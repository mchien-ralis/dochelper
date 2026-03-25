import { v4 as uuidv4 } from 'uuid'

// Simulated in-memory storage (resets on server restart)
const requests = {}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { clientEmail, caseId, documents } = req.body

  if (!clientEmail || !caseId || !documents || documents.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Generate unique ID for this request
  const id = uuidv4()

  // Store the request (simulated)
  requests[id] = {
    id,
    clientEmail,
    caseId,
    documents: documents.map(name => ({
      name,
      status: 'pending',
      fileUrl: null
    })),
    createdAt: new Date().toISOString()
  }

  // Make requests accessible to other API routes
  global.docRequests = requests

  return res.status(200).json({ id })
}
