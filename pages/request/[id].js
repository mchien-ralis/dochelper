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

  const capturePhoto = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    // Capture frame
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    stopCamera()

    // Get base64
    const fullDataUrl = canvas.toDataURL('image/jpeg', 0.85)
    const base64 = fullDataUrl.split(',')[1]

    // Show processing state
    setPreviewImage(fullDataUrl)
    setProcessing(true)

    try {
      // Send to Claude Vision API for crop detection
      const res = await fetch('/api/crop-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      })
      const bounds = await res.json()

      if (bounds.found) {
        // Crop the image based on Claude's detected bounds
        const cropCanvas = document.createElement('canvas')
        const x = (bounds.x / 100) * canvas.width
        const y = (bounds.y / 100) * canvas.height
        const w = (bounds.width / 100) * canvas.width
        const h = (bounds.height / 100) * canvas.height
        cropCanvas.width = w
        cropCanvas.height = h
        const cropCtx = cropCanvas.getContext('2d')
        cropCtx.drawImage(canvas, x, y, w, h, 0, 0, w, h)
        const croppedUrl = cropCanvas.toDataURL('image/jpeg', 0.85)
        setPreviewImage(croppedUrl)
      }
    } catch (err) {
      console.error('Crop failed, using full image', err)
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

          {/* Camera view */}
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

          {/* Processing state */}
          {processing && (
            <div style={{ textAlign: 'center', padding: '30px', background: '#f8fafc', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>✨</div>
              <p style={{ fontWeight: 'bold', color: '#2563eb' }}>Cleaning up your scan...</p>
              <p style={{ color: '#666', fontSize: '14px' }}>AI is detecting and cropping your document</p>
              {previewImage && (
                <img src={previewImage} alt="processing" style={{ width: '100%', borderRadius: '6px', marginTop: '12px', opacity: 0.5 }} />
              )}
            </div>
          )}

          {/* Preview / approve state */}
          {previewImage && !processing && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: 'bold', color: '#16a34a' }}>✅ Scan looks good?</p>
              <img src={previewImage} alt="preview" style={{ width: '100%', borderRadius: '8px', border: '2px solid #86efac', marginBottom: '12px' }} />
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

          {/* Open camera button */}
          {!scanning && !previewImage && (
            <button onClick={startCamera}
              style={{ width: '100%', padding: '20px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', marginBottom: '16px' }}>
              📷 Open Camera
            </button>
          )}

          {/* Captured pages */}
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
