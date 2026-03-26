import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { requestId, docName, images } = req.body

  if (!requestId || !docName) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Get existing request
    const data = await redis.get(`request:${requestId}`)
    if (!data) {
      return res.status(404).json({ error: 'Request not found' })
    }

    const request = typeof data === 'string' ? JSON.parse(data) : data

    // Update the document status
    request.documents = request.documents.map(doc =>
      doc.name === docName
        ? { ...doc, status: 'complete', images: images || [] }
        : doc
    )

    // Save back to Upstash
    await redis.set(`request:${requestId}`, JSON.stringify(request))

    return res.status(200).json({ success: true })

  } catch (err) {
    console.error('Submit document error:', err)
    return res.status(500).json({ error: 'Failed to update document' })
  }
}
