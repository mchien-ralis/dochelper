import { Redis } from '@upstash/redis'
import { v4 as uuidv4 } from 'uuid'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { clientEmail, caseId, documents } = req.body

  if (!clientEmail || !caseId || !documents || documents.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const id = uuidv4()

  const request = {
    id,
    clientEmail,
    caseId,
    documents: documents.map(name => ({
      name,
      status: 'pending',
      images: []
    })),
    createdAt: new Date().toISOString()
  }

  // Save to Upstash
  await redis.set(`request:${id}`, JSON.stringify(request))
  await redis.lpush('requests', id)

  return res.status(200).json({ id })
}
