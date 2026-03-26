import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Confirmation() {
  const router = useRouter()
  const { id, email } = router.query
  const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/request/${id}`
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        .nav-link-primary {
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          background: #1d6fce;
          color: white;
          transition: all 0.2s;
        }
        .nav-link-primary:hover { background: #1a5fb8; }
        .page {
          max-width: 600px;
          margin: 48px auto;
          padding: 0 24px 80px;
        }
        .success-card {
          background: white;
          border-radius: 16px;
          padding: 40px 32px;
          box-shadow: 0 4px 20px rgba(26,43,74,0.08);
          border: 1px solid #e8ecf2;
          text-align: center;
          margin-bottom: 20px;
        }
        .success-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 20px;
          box-shadow: 0 8px 24px rgba(16,185,129,0.3);
        }
        .success-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #1a2b4a;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .success-sub {
          font-size: 14px;
          color: #7a8fa6;
          margin-bottom: 32px;
        }
        .success-sub strong { color: #1a2b4a; font-weight: 600; }
        .link-section {
          background: #f8f9fc;
          border: 1.5px solid #e8ecf2;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 16px;
          text-align: left;
        }
        .link-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8494a9;
          margin-bottom: 8px;
          font-family: 'Montserrat', sans-serif;
        }
        .link-text {
          font-size: 13px;
          color: #3a5a7a;
          word-break: break-all;
          line-height: 1.5;
          font-family: 'Courier New', monospace;
        }
        .btn-copy-default {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #1d6fce, #1a4a8a);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(29,111,206,0.35);
          transition: all 0.3s ease;
          letter-spacing: -0.01em;
        }
        .btn-copy-default:hover { transform: translateY(-2px); }
        .btn-copy-success {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(16,185,129,0.35);
          transition: all 0.3s ease;
          letter-spacing: -0.01em;
        }
        .actions {
          display: flex;
          gap: 12px;
        }
        .btn-dashboard {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Montserrat', sans-serif;
          text-align: center;
          transition: all 0.2s;
          background: white;
          color: #1a2b4a;
          border: 1.5px solid #d4dce8;
          box-shadow: 0 2px 8px rgba(26,43,74,0.06);
          display: block;
        }
        .btn-dashboard:hover {
          border-color: #1d6fce;
          color: #1d6fce;
          transform: translateY(-2px);
        }
        .btn-new {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Montserrat', sans-serif;
          text-align: center;
          transition: all 0.2s;
          background: linear-gradient(135deg, #1d6fce, #1a4a8a);
          color: white;
          border: none;
          box-shadow: 0 4px 16px rgba(29,111,206,0.3);
          display: block;
        }
        .btn-new:hover { transform: translateY(-2px); }
      `}</style>

      <nav className="navbar">
        <a href="/" className="navbar-brand">
          <div className="navbar-logo">Ralis <span>Services</span></div>
        </a>
        <div className="navbar-links">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/create" className="nav-link-primary">+ New Request</a>
        </div>
      </nav>

      <div className="page">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h1 className="success-title">Request Created!</h1>
          <p className="success-sub">
            Send this link to <strong>{email}</strong> to collect their documents.
          </p>
          <div className="link-section">
            <div className="link-label">📎 Client Link</div>
            <div className="link-text">{link}</div>
          </div>
          <button
            className={copied ? 'btn-copy-success' : 'btn-copy-default'}
            onClick={copyLink}
          >
            {copied ? '✅ Copied to Clipboard!' : '📋 Copy Client Link'}
          </button>
        </div>

        <div className="actions">
          <a href="/dashboard" className="btn-dashboard">📊 View Dashboard</a>
          <a href="/create" className="btn-new">➕ New Request</a>
        </div>
      </div>
    </>
  )
}
