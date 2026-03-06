import { getSupabaseAdmin } from './_lib/supabase.js'
import { validateTelegramInitData } from './_lib/telegram.js'

const TABLE_NAME = 'leaderboard_players'

const sendJson = (response, statusCode, body) => {
  response.status(statusCode).setHeader('content-type', 'application/json; charset=utf-8')
  response.send(JSON.stringify(body))
}

const getDisplayName = (user) => {
  if (user.username) {
    return `@${user.username}`
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim()
  return fullName || 'UserName телеграмм'
}

export default async function handler(request, response) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    return sendJson(response, 503, { error: 'leaderboard_not_configured' })
  }

  if (request.method === 'GET') {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('telegram_id, username, coins')
      .order('coins', { ascending: false })
      .order('updated_at', { ascending: true })
      .limit(5)

    if (error) {
      return sendJson(response, 500, { error: 'leaderboard_fetch_failed' })
    }

    return sendJson(response, 200, { entries: data ?? [] })
  }

  if (request.method !== 'POST') {
    response.setHeader('allow', 'GET, POST')
    return sendJson(response, 405, { error: 'method_not_allowed' })
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const initData = request.headers['x-telegram-init-data']
  const user = validateTelegramInitData(initData, botToken)
  let body = request.body || {}

  if (typeof request.body === 'string') {
    try {
      body = JSON.parse(request.body || '{}')
    } catch {
      return sendJson(response, 400, { error: 'invalid_json' })
    }
  }

  if (!user?.id) {
    return sendJson(response, 401, { error: 'telegram_validation_failed' })
  }

  const balance = Number(body.balance ?? 0)
  const lifetimeCollected = Number(body.lifetimeCollected ?? 0)
  const totalFarms = Number(body.totalFarms ?? 0)

  const payload = {
    telegram_id: String(user.id),
    username: getDisplayName(user),
    coins: Number.isFinite(balance) ? Math.max(0, balance) : 0,
    lifetime_collected: Number.isFinite(lifetimeCollected) ? Math.max(0, lifetimeCollected) : 0,
    total_farms: Number.isFinite(totalFarms) ? Math.max(0, Math.floor(totalFarms)) : 0,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from(TABLE_NAME).upsert(payload, {
    onConflict: 'telegram_id',
  })

  if (error) {
    return sendJson(response, 500, { error: 'leaderboard_sync_failed' })
  }

  return sendJson(response, 200, { ok: true })
}
