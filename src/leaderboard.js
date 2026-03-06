const LEADERBOARD_ENDPOINT = '/api/leaderboard'

const parseJson = async (response) => {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export const fetchLeaderboard = async () => {
  const response = await fetch(LEADERBOARD_ENDPOINT, {
    headers: {
      accept: 'application/json',
    },
  })

  const payload = await parseJson(response)

  if (!response.ok) {
    throw new Error(payload?.error || 'leaderboard_fetch_failed')
  }

  return payload
}

export const syncLeaderboard = async ({ initData, balance, lifetimeCollected, totalFarms }) => {
  const response = await fetch(LEADERBOARD_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-telegram-init-data': initData,
    },
    body: JSON.stringify({
      balance,
      lifetimeCollected,
      totalFarms,
    }),
  })

  const payload = await parseJson(response)

  if (!response.ok) {
    throw new Error(payload?.error || 'leaderboard_sync_failed')
  }

  return payload
}
