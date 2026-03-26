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
                text: `Analyze this image and find the document in it. 
                Return ONLY a JSON object with these fields:
                {
                  "found": true/false,
                  "x": left edge as percentage of image width (0-100),
                  "y": top edge as percentage of image height (0-100),
                  "width": document width as percentage (0-100),
                  "height": document height as percentage (0-100)
                }
                If no document is found, return {"found": false}.
                Return ONLY the JSON, no other text.`
              }
            ]
          }
        ]
      })
    })

    const data = await response.json()
    const text = data.content[0].text.trim()
    const bounds = JSON.parse(text)
    return res.status(200).json(bounds)

  } catch (err) {
    console.error('Crop error:', err)
    return res.status(500).json({ error: 'Failed to process image', found: false })
  }
}
