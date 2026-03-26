import { useState, useEffect } from 'react'

const getOverallStatus = (documents) => {
  const total = documents.length
  const complete = documents.filter(d => d.status === 'complete').length
  if (complete === 0) return { label: 'Pending', color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d' }
  if (complete === total) return { label: 'Complete', color: '#059669', bg: '#f0fdf4', border: '#6ee7b7' }
  return { label: `${complete}/${total} Received`, color: '#1d6fce', bg: '#eff6ff', border: '#93c5fd' }
}

export default function Dashboard() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [downloading, setDownloading] = useState(null)

  useEffect(() => { fetchRequests() }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/get-requests')
      const data = await res.json()
      setRequests(data.requests || [])
    } catch (err) {
      console.error('Failed to fetch requests:', err)
    }
    setLoading(false)
  }

  const handleDownload = async (req, doc) => {
    setDownloading(`${req.id}_${doc.name}`)
    try {
      let images = []
      try {
        const key = `dochelper_${req.id}_${doc.name}`
        const stored = localStorage.getItem(key)
        if (stored) images = JSON.parse(stored)
      } catch (e) {}

      if (images.length === 0) {
        const placeholderCanvas = document.createElement('canvas')
        placeholderCanvas.width = 800
        placeholderCanvas.height = 1000
        const ctx = placeholderCanvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, 800, 1000)
        ctx.fillStyle = '#1a2b4a'
        ctx.font = 'bold 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(doc.name, 400, 460)
        ctx.font = '24px sans-serif'
        ctx.fillStyle = '#5a7a9a'
        ctx.fillText(req.caseId, 400, 510)
        ctx.fillText('Ralis Services · DocHelper', 400, 560)
        images = [placeholderCanvas.toDataURL('image/jpeg', 0.85)]
      }

      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images, docName: doc.name, caseId: req.caseId })
      })
      const data = await res.json()
      if (data.pdf) {
        const link = document.createElement('a')
        link.href = `data:application/pdf;base64,${data.pdf}`
        link.download = data.filename
        link.click()
      }
    } catch (err) {
      console.error('Download failed:', err)
      alert('Download failed. Please try again.')
    }
    setDownloading(null)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f8f9fc; font-family: 'Open Sans', sans-serif; color: #1a2b4a; }

        .navbar {
          background: #ffffff;
          border-bottom: 1px solid #e8ecf2;
          padding: 0 40px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-brand { text-decoration: none; }
        .navbar-logo {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: #1a2b4a;
          letter-spacing: -0.02em;
        }
        .navbar-logo span { color: #1d6fce; }
        .navbar-links { display: flex; gap: 8px; align-items: center; }
        .nav-link {
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          color: #5a7a9a;
          transition: all 0.2s;
          border: none;
          background: none;
          cursor: pointer;
        }
        .nav-link:hover { background: #f0f4ff; color: #1d6fce; }
        .nav-link-primary {
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          background: #1d6fce;
          color: white;
          transition: all 0.2s;
          font-family: 'Montserrat', sans-serif;
        }
        .nav-link-primary:hover { background: #1a5fb8; }

        .page {
          max-width: 780px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        .page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .page-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1d6fce;
          margin-bottom: 4px;
        }
        .page-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #1a2b4a;
          letter-spacing: -0.02em;
        }
        .btn-refresh {
          padding: 9px 16px;
          background: white;
          border: 1.5px solid #d4dce8;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #5a7a9a;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Montserrat', sans-serif;
        }
        .btn-refresh:hover { border-color: #1d6fce; color: #1d6fce; background: #f0f4ff; }

        .empty-state {
          text-align: center;
          padding: 60px 40px;
          background: white;
          border-radius: 16px;
          border: 1.5px dashed #d4dce8;
          color: #8494a9;
        }
        .empty-state div { font-size: 40px; margin-bottom: 16px; }
        .empty-state p { font-size: 15px; margin-bottom: 20px; }
        .empty-link {
          color: #1d6fce;
          font-weight: 600;
          text-decoration: none;
          font-family: 'Montserrat', sans-serif;
        }

        .request-card {
          background: white;
          border-radius: 12px;
          border: 1.5px solid #e8ecf2;
          padding: 20px 24px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(26,43,74,0.05);
        }
        .request-card:hover {
          border-color: #93b8e8;
          box-shadow: 0 6px 24px rgba(26,43,74,0.10);
          transform: translateY(-2px);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
        }
        .card-email {
          font-family: 'Montserrat', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1a2b4a;
          margin-bottom: 3px;
        }
        .card-meta {
          font-size: 12px;
          color: #8494a9;
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          white-space: nowrap;
          border: 1.5px solid;
        }
        .doc-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .doc-chip {
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
        }
        .doc-chip-done { background: #dcfce7; color: #059669; }
        .doc-chip-pending { background: #f1f5f9; color: #64748b; }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: white;
          border: 1.5px solid #d4dce8;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #5a7a9a;
          cursor: pointer;
          margin-bottom: 20px;
          font-family: 'Montserrat', sans-serif;
          transition: all 0.2s;
        }
        .back-btn:hover { border-color: #1d6fce; color: #1d6fce; }

        .detail-card {
          background: white;
          border-radius: 16px;
          border: 1.5px solid #e8ecf2;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(26,43,74,0.08);
        }
        .detail-header {
          padding: 24px 28px;
          border-bottom: 1px solid #e8ecf2;
          background: linear-gradient(135deg, #f8f9fc, #f0f4ff);
        }
        .detail-email {
          font-family: 'Montserrat', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #1a2b4a;
          margin-bottom: 4px;
        }
        .detail-meta { font-size: 13px; color: #8494a9; }
        .detail-body { padding: 20px 28px; }

        .doc-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          border-radius: 10px;
          margin-bottom: 10px;
          border: 1.5px solid;
          transition: all 0.2s;
        }
        .doc-row-done {
          background: #f0fdf4;
          border-color: #86efac;
        }
        .doc-row-pending {
          background: #fafbfd;
          border-color: #e8ecf2;
        }
        .doc-name {
          font-weight: 600;
          font-size: 14px;
          color: #1a2b4a;
        }
        .doc-actions { display: flex; gap: 10px; align-items: center; }
        .doc-status-done {
          font-size: 13px;
          font-weight: 700;
          color: #059669;
          font-family: 'Montserrat', sans-serif;
        }
        .doc-status-pending {
          font-size: 13px;
          font-weight: 600;
          color: #f59e0b;
        }
        .btn-download {
          padding: 7px 14px;
          background: linear-gradient(135deg, #1d6fce, #1a4a8a);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(29,111,206,0.3);
        }
        .btn-download:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(29,111,206,0.4); }
        .btn-download:disabled { background: #a0b4c8; box-shadow: none; cursor: not-allowed; }

        .loading-state {
          text-align: center;
          padding: 60px;
          color: #8494a9;
        }
        .loading-state div { font-size: 32px; margin-bottom: 12px; }
      `}</style>

      <nav className="navbar">
        <a href="/" className="navbar-brand">
          <div className="navbar-logo">Ralis <span>Services</span></div>
        </a>
        <div className="navbar-links">
          <button className="nav-link" onClick={fetchRequests}>🔄 Refresh</button>
          <a href="/create" className="nav-link-primary">+ New Request</a>
        </div>
      </nav>

      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-label">📄 DocHelper</div>
            <h1 className="page-title">Document Requests</h1>
          </div>
        </div>

        {!selected ? (
          <div>
            {loading ? (
              <div className="loading-state">
                <div>⏳</div>
                <p>Loading requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="empty-state">
                <div>📭</div>
                <p>No document requests yet.</p>
                <a href="/create" className="empty-link">Create your first request →</a>
              </div>
            ) : (
              requests.map((req) => {
                const status = getOverallStatus(req.documents)
                return (
                  <div key={req.id} className="request-card" onClick={() => setSelected(req)}>
                    <div className="card-top">
                      <div>
                        <div className="card-email">{req.clientEmail}</div>
                        <div className="card-meta">
                          Case: {req.caseId} &nbsp;·&nbsp; {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &nbsp;·&nbsp; {req.documents.length} document{req.documents.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="status-badge" style={{ color: status.color, background: status.bg, borderColor: status.border }}>
                        {status.label}
                      </div>
                    </div>
                    <div className="doc-chips">
                      {req.documents.map((doc, i) => (
                        <span key={i} className={doc.status === 'complete' ? 'doc-chip doc-chip-done' : 'doc-chip doc-chip-pending'}>
                          {doc.status === 'complete' ? '✅' : '⏳'} {doc.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        ) : (
          <div>
            <button className="back-btn" onClick={() => setSelected(null)}>
              ← Back to All Requests
            </button>

            <div className="detail-card">
              <div className="detail-header">
                <div className="detail-email">{selected.clientEmail}</div>
                <div className="detail-meta">
                  Case: {selected.caseId} &nbsp;·&nbsp; Created {new Date(selected.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className="detail-body">
                {selected.documents.map((doc, i) => {
                  const isDownloading = downloading === `${selected.id}_${doc.name}`
                  return (
                    <div key={i} className={doc.status === 'complete' ? 'doc-row doc-row-done' : 'doc-row doc-row-pending'}>
                      <span className="doc-name">{doc.name}</span>
                      <div className="doc-actions">
                        {doc.status === 'complete' ? (
                          <>
                            <span className="doc-status-done">✅ Received</span>
                            <button
                              className="btn-download"
                              onClick={() => handleDownload(selected, doc)}
                              disabled={isDownloading}
                            >
                              {isDownloading ? '⏳ Generating...' : '⬇️ Download PDF'}
                            </button>
                          </>
                        ) : (
                          <span className="doc-status-pending">⏳ Awaiting</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
