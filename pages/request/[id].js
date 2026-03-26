import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function RequestPage() {
  const router = useRouter()
  const { id } = router.query
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDoc, setActiveDoc] = useState(null)
  const [pages, setPages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => { if (id) fetchRequest() }, [id])

  const fetchRequest = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/get-request?id=${id}`)
      const data = await res.json()
      if (data.request) setDocuments(data.request.documents)
    } catch (err) {
      console.error('Failed to fetch request:', err)
    }
    setLoading(false)
  }

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
    if (w < width * 0.2 || h < height * 0.2) return { x: 0, y: 0, w: width, h: height }
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
    } catch (err) { console.error('Crop failed', err) }
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
    if (pages.length === 0) { alert('Please scan at least one page first.'); return }
    setSubmitting(true)
    const imageData = pages.map(p => p.dataUrl)
    try {
      localStorage.setItem(`dochelper_${id}_${activeDoc}`, JSON.stringify(imageData))
    } catch (e) {}
    try {
      await fetch('/api/submit-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id, docName: activeDoc, images: imageData })
      })
    } catch (err) { console.error('Failed to update document status:', err) }
    setDocuments(docs => docs.map(d =>
      d.name === activeDoc ? { ...d, status: 'complete', images: imageData } : d
    ))
    setActiveDoc(null)
    setPages([])
    setSubmitting(false)
  }

  useEffect(() => { return () => stopCamera() }, [])

  const allDone = documents.length > 0 && documents.every(d => d.status === 'complete')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f8f9fc; font-family: 'Open Sans', sans-serif; color: #1a2b4a; min-height: 100vh; }

        .mobile-header {
          background: linear-gradient(135deg, #1a2b4a, #1d4a8a);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mobile-logo {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 16px;
          color: white;
          letter-spacing: -0.02em;
        }
        .mobile-logo span { color: #5db3f5; }
        .mobile-sub {
          font-size: 11px;
          color: #7aa8d4;
          font-weight: 500;
          margin-left: auto;
        }

        .page { padding: 20px 16px 80px; max-width: 480px; margin: 0 auto; }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: #8494a9;
        }
        .loading-state div { font-size: 32px; margin-bottom: 12px; }

        .section-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #8494a9;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .doc-item {
          background: white;
          border-radius: 12px;
          border: 1.5px solid #e8ecf2;
          padding: 16px 18px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(26,43,74,0.05);
          transition: all 0.2s;
        }
        .doc-item-done {
          background: #f0fdf4;
          border-color: #86efac;
        }
        .doc-item-name {
          font-weight: 600;
          font-size: 15px;
          color: #1a2b4a;
        }
        .doc-item-status {
          font-size: 13px;
          font-weight: 700;
          color: #059669;
          font-family: 'Montserrat', sans-serif;
        }
        .btn-scan {
          padding: 9px 18px;
          background: linear-gradient(135deg, #1d6fce, #1a4a8a);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          box-shadow: 0 3px 10px rgba(29,111,206,0.3);
          transition: all 0.2s;
        }
        .btn-scan:hover { transform: translateY(-1px); }

        .scanner-header {
          margin-bottom: 16px;
        }
        .scanner-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1d6fce;
          margin-bottom: 4px;
        }
        .scanner-doc {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #1a2b4a;
        }

        .camera-wrap {
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #1d6fce;
          background: #000;
          aspectRatio: 4/5;
          margin-bottom: 12px;
          box-shadow: 0 4px 20px rgba(29,111,206,0.25);
        }
        .camera-video {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .btn-full {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }
        .btn-capture {
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          box-shadow: 0 4px 16px rgba(5,150,105,0.35);
        }
        .btn-capture:hover { transform: translateY(-2px); }
        .btn-open-camera {
          background: linear-gradient(135deg, #1d6fce, #1a4a8a);
          color: white;
          box-shadow: 0 4px 16px rgba(29,111,206,0.35);
        }
        .btn-open-camera:hover { transform: translateY(-2px); }
        .btn-submit {
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          box-shadow: 0 4px 16px rgba(5,150,105,0.35);
        }
        .btn-submit:disabled { background: #a0b4c8; box-shadow: none; cursor: not-allowed; }
        .btn-secondary {
          background: white;
          color: #5a7a9a;
          border: 1.5px solid #d4dce8;
          box-shadow: none;
        }
        .btn-secondary:hover { border-color: #1d6fce; color: #1d6fce; }

        .processing-card {
          text-align: center;
          padding: 32px 20px;
          background: white;
          border-radius: 12px;
          border: 1.5px solid #e8ecf2;
          margin-bottom: 12px;
        }
        .processing-icon { font-size: 36px; margin-bottom: 10px; }
        .processing-text {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          color: #1d6fce;
          font-size: 15px;
        }
        .processing-sub { font-size: 12px; color: #8494a9; margin-top: 4px; }

        .preview-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #059669;
          margin-bottom: 10px;
        }
        .preview-img {
          width: 100%;
          border-radius: 10px;
          border: 2px solid #86efac;
          margin-bottom: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }

        .pages-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #059669;
          margin-bottom: 8px;
        }
        .pages-grid {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .page-thumb {
          width: 72px;
          height: 72px;
          object-fit: cover;
          border-radius: 8px;
          border: 1.5px solid #86efac;
        }
        .add-page-btn {
          padding: 8px 14px;
          background: #f0fdf4;
          border: 1.5px dashed #6ee7b7;
          border-radius: 8px;
          color: #059669;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          margin-bottom: 16px;
          transition: all 0.2s;
        }
        .add-page-btn:hover { background: #dcfce7; }

        .done-card {
          background: white;
          border-radius: 16px;
          border: 1.5px solid #86efac;
          padding: 40px 24px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(5,150,105,0.1);
        }
        .done-icon {
          font-size: 52px;
          margin-bottom: 16px;
          display: block;
        }
        .done-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #059669;
          margin-bottom: 10px;
        }
        .done-sub { font-size: 14px; color: #7a8fa6; line-height: 1.6; }
      `}</style>

      <div className="mobile-header">
        <div className="mobile-logo">Ralis <span>Services</span></div>
        <div className="mobile-sub">📄 DocHelper</div>
      </div>

      <div className="page">
        {loading ? (
          <div className="loading-state">
            <div>⏳</div>
            <p>Loading your documents...</p>
          </div>
        ) : allDone ? (
          <div className="done-card">
            <span className="done-icon">🎉</span>
            <h2 className="done-title">All Done!</h2>
            <p className="done-sub">All documents submitted successfully.<br />Your processor has been notified.</p>
          </div>
        ) : !activeDoc ? (
          <div>
            <div className="section-title">Documents Required</div>
            {documents.map((doc, i) => (
              <div key={i} className={doc.status === 'complete' ? 'doc-item doc-item-done' : 'doc-item'}>
                <span className="doc-item-name">{doc.name}</span>
                {doc.status === 'complete' ? (
                  <span className="doc-item-status">✅ Done</span>
                ) : (
                  <button className="btn-scan" onClick={() => setActiveDoc(doc.name)}>
                    Scan
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="scanner-header">
              <div className="scanner-title">Now Scanning</div>
              <div className="scanner-doc">{activeDoc}</div>
            </div>

            {scanning && !previewImage && (
              <div>
                <div className="camera-wrap" style={{ aspectRatio: '4/5' }}>
                  <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
                </div>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <button className="btn-full btn-capture" onClick={capturePhoto}>📸 Take Photo</button>
                <button className="btn-full btn-secondary" onClick={() => { stopCamera(); setActiveDoc(null) }}>← Back</button>
              </div>
            )}

            {processing && (
              <div className="processing-card">
                <div className="processing-icon">✨</div>
                <div className="processing-text">Cleaning up your scan...</div>
                <div className="processing-sub">Detecting document edges</div>
              </div>
            )}

            {previewImage && !processing && (
              <div>
                <div className="preview-label">✅ Does this look good?</div>
                <img src={previewImage} alt="preview" className="preview-img" />
                <button className="btn-full btn-capture" onClick={acceptPhoto}>✅ Looks Good</button>
                <button className="btn-full btn-secondary" onClick={retakePhoto}>🔄 Retake</button>
              </div>
            )}

            {!scanning && !previewImage && (
              <button className="btn-full btn-open-camera" onClick={startCamera}>📷 Open Camera</button>
            )}

            {pages.length > 0 && (
              <div>
                <div className="pages-label">✅ {pages.length} page(s) captured</div>
                <div className="pages-grid">
                  {pages.map((p, i) => (
                    <img key={i} src={p.preview} alt={`page ${i + 1}`} className="page-thumb" />
                  ))}
                </div>
                <button className="add-page-btn" onClick={startCamera}>+ Add Another Page</button>
              </div>
            )}

            {pages.length > 0 && (
              <button
                className="btn-full btn-submit"
                onClick={handleSubmitDoc}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : '✅ Submit Document'}
              </button>
            )}

            {!scanning && !previewImage && (
              <button className="btn-full btn-secondary" onClick={() => { setActiveDoc(null); setPages([]) }}>
                ← Back to List
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
