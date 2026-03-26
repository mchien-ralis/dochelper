export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { imageBase64 } = req.body

  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageBase64
                }
              },
              {
                type: 'text',
                text: `Look at this image carefully. Find the document, paper, receipt, or card in it.
                
The image is 100 units wide and 100 units tall.

Return ONLY a raw JSON object — no markdown, no backticks, no explanation.

If you find a document:
{"found": true, "x": LEFT_EDGE, "y": TOP_EDGE, "width": DOCUMENT_WIDTH, "height": DOCUMENT_HEIGHT}

If no document found:
{"found": false, "x": 0, "y": 0, "width": 100, "height": 100}

All values are percentages of the full image dimensions (0-100).
Be generous with the crop — include a small margin around the document.
Return ONLY the JSON object, nothing else.`
              }
            ]
          }
        ]
      })
    })

    const data = await response.json()
    
    if (!data.content || !data.content[0]) {
      return res.status(200).json({ found: false, x: 0, y: 0, width: 100, height: 100 })
    }

    const text = data.content[0].text.trim()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    try {
      const bounds = JSON.parse(text)
      return res.status(200).json(bounds)
    } catch {
      return res.status(200).json({ found: false, x: 0, y: 0, width: 100, height: 100 })
    }

  } catch (err) {
    console.error('Crop error:', err)
    return res.status(200).json({ found: false, x: 0, y: 0, width: 100, height: 100 })
  }
}
