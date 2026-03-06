import { withDatabase } from './_lib/sqlite.js'
import { validateTelegramInitData } from './_lib/telegram.js'

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
  if (request.method === 'GET') {
    try {
      const entries = await withDatabase(async (database) => {
        const statement = database.prepare(`
          select telegram_id, username, coins
          from leaderboard_players
          order by coins desc, updated_at asc
          limit 5
        `)
        const rows = []

        while (statement.step()) {
          rows.push(statement.getAsObject())
        }

        statement.free()
        return rows
      })

      return sendJson(response, 200, { entries })
    } catch {
      return sendJson(response, 500, { error: 'leaderboard_fetch_failed' })
    }
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

  try {
    await withDatabase(async (database) => {
      database.run(
        `
          insert into leaderboard_players (
            telegram_id,
            username,
            coins,
            lifetime_collected,
            total_farms,
            updated_at
          ) values (
            $telegram_id,
            $username,
            $coins,
            $lifetime_collected,
            $total_farms,
            $updated_at
          )
          on conflict(telegram_id) do update set
            username = excluded.username,
            coins = excluded.coins,
            lifetime_collected = excluded.lifetime_collected,
            total_farms = excluded.total_farms,
            updated_at = excluded.updated_at
        `,
        {
          $telegram_id: payload.telegram_id,
          $username: payload.username,
          $coins: payload.coins,
          $lifetime_collected: payload.lifetime_collected,
          $total_farms: payload.total_farms,
          $updated_at: payload.updated_at,
        },
      )
    })
  } catch {
    return sendJson(response, 500, { error: 'leaderboard_sync_failed' })
  }

  return sendJson(response, 200, { ok: true })
}
