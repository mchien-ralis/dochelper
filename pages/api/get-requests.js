import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get all request IDs
    const ids = await redis.lrange('requests', 0, -1)

    if (!ids || ids.length === 0) {
      return res.status(200).json({ requests: [] })
    }

    // Fetch all requests
    const requests = await Promise.all(
      ids.map(async (id) => {
        const data = await redis.get(`request:${id}`)
        if (!data) return null
        return typeof data === 'string' ? JSON.parse(data) : data
      })
    )

    const filtered = requests.filter(Boolean)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return res.status(200).json({ requests: filtered })

  } catch (err) {
    console.error('Get requests error:', err)
    return res.status(500).json({ error: 'Failed to fetch requests' })
  }
}
