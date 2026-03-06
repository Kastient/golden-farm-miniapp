import crypto from 'node:crypto'

const MAX_INIT_DATA_AGE_SECONDS = 60 * 60 * 24 * 7

const buildDataCheckString = (initData) => {
  const params = new URLSearchParams(initData)
  const entries = []

  for (const [key, value] of params.entries()) {
    if (key === 'hash') {
      continue
    }

    entries.push(`${key}=${value}`)
  }

  return entries.sort().join('\n')
}

export const validateTelegramInitData = (initData, botToken) => {
  if (!initData || !botToken) {
    return null
  }

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  const authDate = Number(params.get('auth_date'))

  if (!hash || !Number.isFinite(authDate)) {
    return null
  }

  const ageSeconds = Math.floor(Date.now() / 1000) - authDate
  if (ageSeconds > MAX_INIT_DATA_AGE_SECONDS) {
    return null
  }

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest()
  const dataCheckString = buildDataCheckString(initData)
  const expectedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  if (expectedHash !== hash) {
    return null
  }

  const userRaw = params.get('user')
  if (!userRaw) {
    return null
  }

  try {
    return JSON.parse(userRaw)
  } catch {
    return null
  }
}
