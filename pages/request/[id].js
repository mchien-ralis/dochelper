import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function RequestPage() {
  const router = useRouter()
  const { id } = router.query
  const [documents, setDocuments] = useState([
    { name: "Driver's License", status: 'pending' },
    { name: 'Proof of Income', status: 'pending' },
    { name: 'Bank Statement', status: 'pending' }
  ])
  const [activeDoc, setActiveDoc] = useState(null)
  const [pages, setPages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const startCamera = async () => {
    setScanning(true)
    setPreviewImage(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      alert('Camera access denied. Please allow camera permissions.')
      setScanning(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setScanning(false)
  }

  const findDocumentBounds = (imageData, width, height) => {
    const data = imageData.data
    const edgeMap = []

    for (let y = 0; y < height; y++) {
      edgeMap[y] = []
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4
        edgeMap[y][x] = (data[i] + data[i + 1] + data[i + 2]) / 3
      }
    }

    const threshold = 30
    let minX = width, maxX = 0, minY = height, maxY = 0

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const diff = Math.abs(edgeMap[y][x] - edgeMap[y][x + 1]) +
          Math.abs(edgeMap[y][x] - edgeMap[y + 1][x])
        if (diff > threshold) {
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }

    const pad = 15
    const x = Math.max(0, minX - pad)
    const y = Math.max(0, minY - pad)
    const w = Math.min(width - x, maxX - minX + pad * 2)
    const h = Math.min(height - y, maxY - minY + pad * 2)

    if (w < width * 0.2 || h < height * 0.2) {
      return { x: 0, y: 0, w: width, h: height }
    }

    return { x, y, w, h }
  }

  const capturePhoto = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    stopCamera()

    const fullDataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setPreviewImage(fullDataUrl)
    setProcessing(true)

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const bounds = findDocumentBounds(imageData, canvas.width, canvas.height)

      const cropCanvas = document.createElement('canvas')
      cropCanvas.width = bounds.w
      cropCanvas.height = bounds.h
      const cropCtx = cropCanvas.getContext('2d')
      cropCtx.drawImage(canvas, bounds.x, bounds.y, bounds.w, bounds.h, 0, 0, bounds.w, bounds.h)
      setPreviewImage(cropCanvas.toDataURL('image/jpeg', 0.9))
    } catch (err) {
      console.error('Crop failed', err)
    }

    setProcessing(false)
  }

  const acceptPhoto = () => {
    if (previewImage) {
      setPages(prev => [...prev, { preview: previewImage, dataUrl: previewImage }])
      setPreviewImage(null)
    }
  }

  const retakePhoto = () => {
    setPreviewImage(null)
    startCamera()
  }

  const handleSubmitDoc = async () => {
    if (pages.length === 0) {
      alert('Please scan at least one page first.')
      return
    }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setDocuments(docs => docs.map(d =>
      d.name === activeDoc ? { ...d, status: 'complete' } : d
    ))
    setActiveDoc(null)
    setPages([])
    setSubmitting(false)
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  const allDone = documents.every(d => d.status === 'complete')

  if (allDone) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h1>📄 DocHelper</h1>
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '30px' }}>
          <div style={{ fontSize: '48px' }}>🎉</div>
          <h2 style={{ color: '#16a34a' }}>All Done!</h2>
          <p>All documents submitted successfully. Your processor has been notified.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px' }}>📄 DocHelper</h1>
      <p style={{ color: '#666', marginTop: '-10px' }}>Please scan and submit the following documents:</p>

      {!activeDoc ? (
        <div>
          {documents.map((doc, i) => (
            <div key={i} style={{
              padding: '16px', marginBottom: '12px', borderRadius: '8px',
              border: `1px solid ${doc.status === 'complete' ? '#86efac' : '#e5e7eb'}`,
              background: doc.status === 'complete' ? '#f0fdf4' : 'white',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontWeight: '500' }}>{doc.name}</span>
              {doc.status === 'complete' ? (
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✅ Done</span>
              ) : (
                <button onClick={() => setActiveDoc(doc.name)}
                  style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Scan
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3>📷 Scanning: {activeDoc}</h3>

          {scanning && !previewImage && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '3px solid #2563eb' }}>
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block' }} />
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <button onClick={capturePhoto}
                style={{ width: '100%', marginTop: '12px', padding: '16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer' }}>
                📸 Take Photo
              </button>
              <button onClick={() => { stopCamera(); setActiveDoc(null) }}
                style={{ width: '100%', marginTop: '8px', padding: '12px', background: '#f0f0f0', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
                ← Back
              </button>
            </div>
          )}

          {processing && (
            <div style={{ textAlign: 'center', padding: '30px', background: '#f8fafc', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>✨</div>
              <p style={{ fontWeight: 'bold', color: '#2563eb' }}>Cleaning up your scan...</p>
            </div>
          )}

          {previewImage && !processing && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: 'bold', color: '#16a34a' }}>✅ Scan ready — does it look good?</p>
              <img src={previewImage} alt="preview"
                style={{ width: '100%', borderRadius: '8px', border: '2px solid #86efac', marginBottom: '12px' }} />
              <button onClick={acceptPhoto}
                style={{ width: '100%', padding: '14px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', marginBottom: '8px' }}>
                ✅ Looks Good
              </button>
              <button onClick={retakePhoto}
                style={{ width: '100%', padding: '12px', background: '#f0f0f0', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
                🔄 Retake
              </button>
            </div>
          )}

          {!scanning && !previewImage && (
            <button onClick={startCamera}
              style={{ width: '100%', padding: '20px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', marginBottom: '16px' }}>
              📷 Open Camera
            </button>
          )}

          {pages.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: 'bold' }}>✅ {pages.length} page(s) captured:</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {pages.map((p, i) => (
                  <img key={i} src={p.preview} alt={`page ${i + 1}`}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ccc' }} />
                ))}
              </div>
              <button onClick={startCamera}
                style={{ marginTop: '8px', padding: '8px 16px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                + Add Another Page
              </button>
            </div>
          )}

          {pages.length > 0 && (
            <button onClick={handleSubmitDoc} disabled={submitting}
              style={{ width: '100%', padding: '14px', background: submitting ? '#ccc' : '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: submitting ? 'not-allowed' : 'pointer', marginBottom: '10px' }}>
              {submitting ? 'Submitting...' : '✅ Submit Document'}
            </button>
          )}

          {!scanning && !previewImage && (
            <button onClick={() => { setActiveDoc(null); setPages([]) }}
              style={{ width: '100%', padding: '12px', background: '#f0f0f0', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
              ← Back to List
            </button>
          )}
        </div>
      )}
    </div>
  )
}
