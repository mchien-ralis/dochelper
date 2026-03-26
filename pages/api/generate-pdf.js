import { PDFDocument } from 'pdf-lib'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { images, docName, caseId } = req.body

  if (!images || images.length === 0) {
    return res.status(400).json({ error: 'No images provided' })
  }

  try {
    const pdfDoc = await PDFDocument.create()

    for (const imageData of images) {
      const base64 = imageData.replace(/^data:image\/\w+;base64,/, '')
      const imageBytes = Buffer.from(base64, 'base64')

      let image
      if (imageData.includes('image/png')) {
        image = await pdfDoc.embedPng(imageBytes)
      } else {
        image = await pdfDoc.embedJpg(imageBytes)
      }

      const page = pdfDoc.addPage([image.width, image.height])
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height
      })
    }

    const pdfBytes = await pdfDoc.save()
    const base64Pdf = Buffer.from(pdfBytes).toString('base64')

    return res.status(200).json({ 
      pdf: base64Pdf,
      filename: `${caseId}_${docName.replace(/\s+/g, '_')}.pdf`
    })

  } catch (err) {
    console.error('PDF generation error:', err)
    return res.status(500).json({ error: 'Failed to generate PDF' })
  }
}
