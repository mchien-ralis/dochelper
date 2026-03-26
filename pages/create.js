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
        .navbar-links { display: flex; gap: 8px; }
        .nav-link {
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          color: #5a7a9a;
          transition: all 0.2s;
        }
        .nav-link:hover { background: #f0f4ff; color: #1d6fce; }
        .nav-link.active { background: #1d6fce; color: white; }

        .page {
          max-width: 600px;
          margin: 48px auto;
          padding: 0 24px 80px;
        }

        .page-header { margin-bottom: 32px; }
        .page-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1d6fce;
          margin-bottom: 6px;
        }
        .page-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #1a2b4a;
          letter-spacing: -0.02em;
        }
        .page-sub {
          font-size: 14px;
          color: #7a8fa6;
          margin-top: 6px;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(26,43,74,0.08);
          border: 1px solid #e8ecf2;
        }

        .form-group { margin-bottom: 24px; }
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1a2b4a;
          margin-bottom: 8px;
          font-family: 'Montserrat', sans-serif;
        }
        .form-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          border: 1.5px solid #d4dce8;
          border-radius: 8px;
          font-family: 'Open Sans', sans-serif;
          color: #1a2b4a;
          background: #fafbfd;
          transition: all 0.2s;
          outline: none;
        }
        .form-input:focus {
          border-color: #1d6fce;
          background: white;
          box-shadow: 0 0 0 3px rgba(29,111,206,0.1);
        }
        .form-input::placeholder { color: #b0bfce; }

        .divider {
          height: 1px;
          background: #e8ecf2;
          margin: 28px 0;
        }

        .doc-row {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
          align-items: center;
        }
        .doc-input {
          flex: 1;
          padding: 11px 14px;
          font-size: 14px;
          border: 1.5px solid #d4dce8;
          border-radius: 8px;
          font-family: 'Open Sans', sans-serif;
          color: #1a2b4a;
          background: #fafbfd;
          transition: all 0.2s;
          outline: none;
        }
        .doc-input:focus {
          border-color: #1d6fce;
          background: white;
          box-shadow: 0 0 0 3px rgba(29,111,206,0.1);
        }
        .doc-input::placeholder { color: #b0bfce; }
        .btn-remove {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1.5px solid #fcd4d4;
          background: #fff5f5;
          color: #e05252;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .btn-remove:hover { background: #fee2e2; border-color: #e05252; }

        .btn-add {
          padding: 10px 18px;
          background: #f0f4ff;
          border: 1.5px dashed #93b8e8;
          border-radius: 8px;
          color: #1d6fce;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          transition: all 0.2s;
          margin-top: 4px;
        }
        .btn-add:hover { background: #dbeafe; border-color: #1d6fce; }

        .btn-submit {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #1d6fce, #1a4a8a);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          margin-top: 28px;
          box-shadow: 0 4px 16px rgba(29,111,206,0.35);
          transition: all 0.2s;
          letter-spacing: -0.01em;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(29,111,206,0.4);
        }
        .btn-submit:disabled {
          background: #a0b4c8;
          box-shadow: none;
          cursor: not-allowed;
        }
      `}</style>

      <nav className="navbar">
        <a href="/" className="navbar-brand">
          <div className="navbar-logo">Ralis <span>Services</span></div>
        </a>
        <div className="navbar-links">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/create" className="nav-link active">+ New Request</a>
        </div>
      </nav>

      <div className="page">
        <div className="page-header">
          <div className="page-label">📄 DocHelper</div>
          <h1 className="page-title">New Document Request</h1>
          <p className="page-sub">Fill in the details below to generate a secure client link.</p>
        </div>

        <div className="card">
          <div className="form-group">
            <label className="form-label">Client Email</label>
            <input
              type="email"
              className="form-input"
              value={clientEmail}
              onChange={e => setClientEmail(e.target.value)}
              placeholder="client@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Case / Reference ID</label>
            <input
              type="text"
              className="form-input"
              value={caseId}
              onChange={e => setCaseId(e.target.value)}
              placeholder="e.g. CASE-2024-001"
            />
          </div>

          <div className="divider" />

          <div className="form-group">
            <label className="form-label">Documents Required</label>
            {documents.map((doc, index) => (
              <div className="doc-row" key={index}>
                <input
                  type="text"
                  className="doc-input"
                  value={doc}
                  onChange={e => updateDocument(index, e.target.value)}
                  placeholder={`e.g. Driver's License`}
                />
                {documents.length > 1 && (
                  <button className="btn-remove" onClick={() => removeDocument(index)}>✕</button>
                )}
              </div>
            ))}
            <button className="btn-add" onClick={addDocument}>+ Add Document</button>
          </div>

          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : '🔗 Generate Request Link'}
          </button>
        </div>
      </div>
    </>
  )
}
