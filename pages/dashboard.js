import { useState, useEffect } from 'react'

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
  const [requests, setRequests] = useState(MOCK_REQUESTS)
  const [selected, setSelected] = useState(null)

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
            const complete = req.documents.filter(d => d.status === 'complete').length
            return (
              <div key={req.id}
                onClick={() => setSelected(req)}
                style={{
                  padding: '16px', marginBottom: '12px', borderRadius: '8px',
                  border: '1px solid #e5e7eb', background: 'white',
                  cursor: 'pointer', transition: 'box-shadow 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
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
              {selected.documents.map((doc, i) => (
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
                        <button style={{
                          padding: '6px 12px', background: '#2563eb', color: 'white',
                          border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                        }}>
                          ⬇️ Download
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#f59e0b', fontWeight: '500' }}>⏳ Awaiting</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
