import { useState } from 'react'
import { useRouter } from 'next/router'

export default function CreateRequest() {
  const router = useRouter()
  const [clientEmail, setClientEmail] = useState('')
  const [caseId, setCaseId] = useState('')
  const [documents, setDocuments] = useState([''])
  const [loading, setLoading] = useState(false)

  const addDocument = () => setDocuments([...documents, ''])
  
  const updateDocument = (index, value) => {
    const updated = [...documents]
    updated[index] = value
    setDocuments(updated)
  }

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    const filtered = documents.filter(d => d.trim() !== '')
    if (!clientEmail || !caseId || filtered.length === 0) {
      alert('Please fill in all fields and add at least one document.')
      return
    }
    setLoading(true)
    const res = await fetch('/api/create-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientEmail, caseId, documents: filtered })
    })
    const data = await res.json()
    router.push(`/confirmation?id=${data.id}&email=${clientEmail}`)
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>📄 DocHelper</h1>
      <h2>New Document Request</h2>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Client Email</label>
        <input
          type="email"
          value={clientEmail}
          onChange={e => setClientEmail(e.target.value)}
          placeholder="client@example.com"
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Case / Reference ID</label>
        <input
          type="text"
          value={caseId}
          onChange={e => setCaseId(e.target.value)}
          placeholder="e.g. CASE-2024-001"
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Documents Required</label>
        {documents.map((doc, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={doc}
              onChange={e => updateDocument(index, e.target.value)}
              placeholder={`e.g. Driver's License`}
              style={{ flex: 1, padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            {documents.length > 1 && (
              <button
                onClick={() => removeDocument(index)}
                style={{ padding: '10px', background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}
              >✕</button>
            )}
          </div>
        ))}
        <button
          onClick={addDocument}
          style={{ padding: '10px 20px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
        >+ Add Document</button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: '100%', padding: '14px', background: loading ? '#ccc' : '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer' }}
      >{loading ? 'Creating...' : 'Generate Request Link'}</button>
    </div>
  )
}
