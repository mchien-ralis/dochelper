import { useState } from 'react'
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

  const handleCapture = (e) => {
    const files = Array.from(e.target.files)
    const newPages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setPages([...pages, ...newPages])
  }

  const handleSubmitDoc = async () => {
    if (pages.length === 0) {
      alert('Please scan at least one page first.')
      return
    }
    setSubmitting(true)

    // Simulate upload delay
    await new Promise(r => setTimeout(r, 1500))

    setDocuments(docs => docs.map(d =>
      d.name === activeDoc ? { ...d, status: 'complete' } : d
    ))
    setActiveDoc(null)
    setPages([])
    setSubmitting(false)
  }

  const allDone = documents.every(d => d.status === 'complete')

  if (allDone) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h1>📄 DocHelper</h1>
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '30px' }}>
          <div style={{ fontSize: '48px' }}>🎉</div>
          <h2 style={{ color: '#16a34a' }}>All Done!</h2>
          <p>All documents have been submitted successfully. Your processor has been notified.</p>
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
              padding: '16px',
              marginBottom: '12px',
              borderRadius: '8px',
              border: `1px solid ${doc.status === 'complete' ? '#86efac' : '#e5e7eb'}`,
              background: doc.status === 'complete' ? '#f0fdf4' : 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '500' }}>{doc.name}</span>
              {doc.status === 'complete' ? (
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✅ Done</span>
              ) : (
                <button
                  onClick={() => setActiveDoc(doc.name)}
                  style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >Scan</button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3>📷 Scanning: {activeDoc}</h3>

          <label style={{
            display: 'block',
            padding: '20px',
            background: '#f8fafc',
            border: '2px dashed #cbd5e1',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '16px'
          }}>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleCapture}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '32px' }}>📷</div>
            <div style={{ marginTop: '8px', color: '#475569' }}>Tap to scan page</div>
          </label>

          {pages.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: 'bold' }}>{pages.length} page(s) scanned:</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {pages.map((p, i) => (
                  <img key={i} src={p.preview} alt={`page ${i+1}`}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ccc' }} />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmitDoc}
            disabled={submitting}
            style={{ width: '100%', padding: '14px', background: submitting ? '#ccc' : '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: submitting ? 'not-allowed' : 'pointer', marginBottom: '10px' }}
          >{submitting ? 'Submitting...' : '✅ Submit Document'}</button>

          <button
            onClick={() => { setActiveDoc(null); setPages([]) }}
            style={{ width: '100%', padding: '12px', background: '#f0f0f0', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
          >← Back to List</button>
        </div>
      )}
    </div>
  )
}
