export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { imageBase64 } = req.body

  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' })
  }

  // Return instructions for client-side cropping
  // The actual cropping happens in the browser using canvas
  return res.status(200).json({ 
    found: true, 
    clientSideCrop: true 
  })
}
