import { useState } from 'react'

const MOCK_REQUESTS = [
  {
    id: 'abc-123',
    clientEmail: 'john.doe@example.com',
    caseId: 'CASE-2024-001',
    createdAt: '2026-03-25T08:00:00Z',
    documents: [
      { name: "Driver's License", status: 'complete' },
      { name: 'Proof of Income', status: 'complete' },
      { name: 'Bank Statement', status: 'pending' }
    ]
  },
  {
    id: 'def-456',
    clientEmail: 'jane.smith@example.com',
    caseId: 'CASE-2024-002',
    createdAt: '2026-03-25T09:00:00Z',
    documents: [
      { name: "Driver's License", status: 'complete' },
      { name: 'Proof of Income', status: 'complete' },
      { name: 'Bank Statement', status: 'complete' }
    ]
  },
  {
    id: 'ghi-789',
    clientEmail: 'bob.jones@example.com',
    caseId: 'CASE-2024-003',
    createdAt: '2026-03-25T10:00:00Z',
    documents: [
      { name: "Driver's License", status: 'pending' },
      { name: 'Proof of Income', status: 'pending' },
      { name: 'Bank Statement', status: 'pending' }
    ]
  }
]

const getOverallStatus = (documents) => {
  const total = documents.length
  const complete = documents.filter(d => d.status === 'complete').length
  if (complete === 0) return { label: 'Pending', color: '#f59e0b', bg: '#fffbeb' }
  if (complete === total) return { label: 'Complete', color: '#16a34a', bg: '#f0fdf4' }
  return { label: `${complete}/${total} Received`, color: '#2563eb', bg: '#eff6ff' }
}

export default function Dashboard() {
  const [requests] = useState(MOCK_REQUESTS)
  const [selected, setSelected] = useState(null)
  const [downloading, setDownloading] = useState(null)

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
        ctx.fillStyle = '#333333'
        ctx.font = 'bold 32px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(doc.name, 400, 460)
        ctx.font = '24px sans-serif'
        ctx.fillText(req.caseId, 400, 510)
        ctx.fillText('Demo Document', 400, 560)
        images = [placeholderCanvas.toDataURL('image/jpeg', 0.85)]
      }

      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images,
          docName: doc.name,
          caseId: req.caseId
        })
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
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>📄 DocHelper</h1>
        <a href="/create" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
          + New Request
        </a>
      </div>

      <h2 style={{ marginBottom: '16px', fontSize: '18px', color: '#374151' }}>Document Requests</h2>

      {!selected ? (
        <div>
          {requests.map((req) => {
            const status = getOverallStatus(req.documents)
            return (
              <div key={req.id}
                onClick={() => setSelected(req)}
                style={{
                  padding: '16px', marginBottom: '12px', borderRadius: '8px',
                  border: '1px solid #e5e7eb', background: 'white',
                  cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{req.clientEmail}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Case: {req.caseId}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      {new Date(req.createdAt).toLocaleDateString()} · {req.documents.length} documents
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 12px', borderRadius: '20px',
                    background: status.bg, color: status.color,
                    fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap'
                  }}>
                    {status.label}
                  </div>
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {req.documents.map((doc, i) => (
                    <span key={i} style={{
                      padding: '3px 10px', borderRadius: '12px', fontSize: '12px',
                      background: doc.status === 'complete' ? '#dcfce7' : '#f3f4f6',
                      color: doc.status === 'complete' ? '#16a34a' : '#6b7280'
                    }}>
                      {doc.status === 'complete' ? '✅' : '⏳'} {doc.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div>
          <button onClick={() => setSelected(null)}
            style={{ marginBottom: '16px', padding: '8px 16px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            ← Back to All Requests
          </button>

          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ marginTop: 0 }}>{selected.clientEmail}</h3>
            <p style={{ color: '#6b7280', marginTop: '-8px' }}>Case: {selected.caseId}</p>

            <div style={{ marginTop: '16px' }}>
              {selected.documents.map((doc, i) => {
                const isDownloading = downloading === `${selected.id}_${doc.name}`
                return (
                  <div key={i} style={{
                    padding: '14px', marginBottom: '10px', borderRadius: '8px',
                    border: `1px solid ${doc.status === 'complete' ? '#86efac' : '#e5e7eb'}`,
                    background: doc.status === 'complete' ? '#f0fdf4' : '#f9fafb',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: '500' }}>{doc.name}</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {doc.status === 'complete' ? (
                        <>
                          <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✅ Received</span>
                          <button
                            onClick={() => handleDownload(selected, doc)}
                            disabled={isDownloading}
                            style={{
                              padding: '6px 12px',
                              background: isDownloading ? '#ccc' : '#2563eb',
                              color: 'white', border: 'none', borderRadius: '6px',
                              cursor: isDownloading ? 'not-allowed' : 'pointer',
                              fontSize: '12px'
                            }}>
                            {isDownloading ? '⏳ Generating...' : '⬇️ Download PDF'}
                          </button>
                        </>
                      ) : (
                        <span style={{ color: '#f59e0b', fontWeight: '500' }}>⏳ Awaiting</span>
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
  )
}
