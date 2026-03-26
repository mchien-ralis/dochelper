import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Missing request ID' })
  }

  try {
    const data = await redis.get(`request:${id}`)
    if (!data) {
      return res.status(404).json({ error: 'Request not found' })
    }
    const request = typeof data === 'string' ? JSON.parse(data) : data
    return res.status(200).json({ request })
  } catch (err) {
    console.error('Get request error:', err)
    return res.status(500).json({ error: 'Failed to fetch request' })
  }
}
