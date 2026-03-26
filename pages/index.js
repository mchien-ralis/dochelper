import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #f8f9fc;
          color: #1a2b4a;
          font-family: 'Open Sans', sans-serif;
          min-height: 100vh;
        }

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

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .navbar-logo {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: #1a2b4a;
          letter-spacing: -0.02em;
        }

        .navbar-logo span {
          color: #1d6fce;
        }

        .navbar-sub {
          font-size: 11px;
          color: #8494a9;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .hero {
          background: linear-gradient(160deg, #1a2b4a 0%, #1d4a8a 60%, #1d6fce 100%);
          padding: 80px 40px 100px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .hero-content {
          position: relative;
          max-width: 640px;
          margin: 0 auto;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : 20}px);
          transition: all 0.6s ease;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: #a8c8f0;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .hero-icon {
          font-size: 52px;
          display: block;
          margin-bottom: 20px;
        }

        .hero h1 {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(32px, 6vw, 52px);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .hero h1 span {
          color: #5db3f5;
        }

        .hero-sub {
          font-size: 17px;
          color: #a8bdd4;
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-white {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: #ffffff;
          color: #1a2b4a;
          border-radius: 8px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: -0.01em;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }

        .btn-white:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: transparent;
          color: #ffffff;
          border: 2px solid rgba(255,255,255,0.4);
          border-radius: 8px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-outline:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.7);
          transform: translateY(-2px);
        }

        .main {
          max-width: 900px;
          margin: -40px auto 0;
          padding: 0 24px 80px;
          position: relative;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 48px;
        }

        .card {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(26,43,74,0.08);
          border: 1px solid #e8ecf2;
          text-align: center;
          transition: all 0.2s ease;
        }

        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(26,43,74,0.12);
        }

        .card-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }

        .card-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #1a2b4a;
          margin-bottom: 6px;
        }

        .card-desc {
          font-size: 12px;
          color: #7a8fa6;
          line-height: 1.5;
        }

        .how-it-works {
          background: #ffffff;
          border-radius: 16px;
          padding: 36px;
          box-shadow: 0 4px 20px rgba(26,43,74,0.08);
          border: 1px solid #e8ecf2;
        }

        .section-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1d6fce;
          margin-bottom: 8px;
        }

        .section-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #1a2b4a;
          margin-bottom: 28px;
          letter-spacing: -0.02em;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 24px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .step-num {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1d6fce, #1a4a8a);
          color: white;
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #1a2b4a;
        }

        .step-desc {
          font-size: 12px;
          color: #7a8fa6;
          line-height: 1.5;
        }

        .footer {
          text-align: center;
          padding: 24px;
          font-size: 12px;
          color: #a0aebe;
          border-top: 1px solid #e8ecf2;
          background: white;
        }

        @media (max-width: 600px) {
          .hero { padding: 60px 24px 80px; }
          .hero-buttons { flex-direction: column; align-items: center; }
          .steps { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div>
            <div className="navbar-logo">Ralis <span>Services</span></div>
          </div>
        </div>
        <div className="navbar-sub">AI Initiative</div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Internal Tool · AI Demo</div>
          <span className="hero-icon">📄</span>
          <h1>Doc<span>Helper</span></h1>
          <p className="hero-sub">
            Smart document intake for modern teams.<br />
            Clients scan on their phone. You get clean PDFs.
          </p>
          <div className="hero-buttons">
            <a href="/create" className="btn-white">➕ New Document Request</a>
            <a href="/dashboard" className="btn-outline">📊 Processor Dashboard</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main">

        {/* Feature Cards */}
        <div className="cards">
          {[
            { icon: '📱', title: 'Mobile First', desc: 'Clients scan from any phone — no app download required' },
            { icon: '⚡', title: 'Instant Updates', desc: 'Dashboard updates in real time as documents arrive' },
            { icon: '📥', title: 'Clean PDFs', desc: 'Scans auto-convert to organized, downloadable PDFs' },
            { icon: '🔒', title: 'Secure Links', desc: 'Each request gets a unique, secure client link' }
          ].map((c, i) => (
            <div className="card" key={i}>
              <span className="card-icon">{c.icon}</span>
              <div className="card-title">{c.title}</div>
              <div className="card-desc">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="how-it-works">
          <div className="section-label">Workflow</div>
          <div className="section-title">How DocHelper Works</div>
          <div className="steps">
            {[
              { n: '1', title: 'Create a Request', desc: 'Enter client email, case ID, and required document list' },
              { n: '2', title: 'Send the Link', desc: 'Client receives a secure link — no login required' },
              { n: '3', title: 'Client Scans', desc: 'Client opens link on phone and scans each document' },
              { n: '4', title: 'Download PDF', desc: 'Processor receives clean PDFs ready to file' }
            ].map((s, i) => (
              <div className="step" key={i}>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        © 2026 Ralis Services Corp. · DocHelper AI Initiative · Orange, CA
      </div>
    </>
  )
}
