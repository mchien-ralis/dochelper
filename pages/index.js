import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #0a0f1e;
          color: #f0f4ff;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }

        .orb-1 {
          width: 500px; height: 500px;
          background: #3b82f6;
          top: -100px; right: -100px;
        }

        .orb-2 {
          width: 400px; height: 400px;
          background: #10b981;
          bottom: -80px; left: -80px;
        }

        .orb-3 {
          width: 300px; height: 300px;
          background: #6366f1;
          top: 40%; left: 40%;
          transform: translate(-50%, -50%);
        }

        .content {
          position: relative;
          z-index: 1;
          max-width: 560px;
          width: 100%;
          text-align: center;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : 24}px);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(59,130,246,0.15);
          border: 1px solid rgba(59,130,246,0.3);
          color: #93c5fd;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #3b82f6;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .icon {
          font-size: 56px;
          margin-bottom: 20px;
          display: block;
          filter: drop-shadow(0 0 20px rgba(59,130,246,0.5));
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 8vw, 64px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tagline {
          font-size: 17px;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 48px;
          max-width: 420px;
          margin-left: auto;
          margin-right: auto;
        }

        .buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 56px;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px 32px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border-radius: 14px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.01em;
          box-shadow: 0 8px 32px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(37,99,235,0.5);
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px 32px;
          background: rgba(255,255,255,0.05);
          color: #e2e8f0;
          border-radius: 14px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.2);
        }

        .steps {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          text-align: left;
          backdrop-filter: blur(20px);
        }

        .steps-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 20px;
        }

        .step {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .step:last-child { border-bottom: none; }

        .step-num {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(59,130,246,0.15);
          border: 1px solid rgba(59,130,246,0.2);
          color: #60a5fa;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: 'Syne', sans-serif;
        }

        .step-text strong {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 2px;
        }

        .step-text span {
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
        }

        .footer {
          margin-top: 32px;
          font-size: 12px;
          color: #334155;
          letter-spacing: 0.02em;
        }

        @media (max-width: 480px) {
          .page { padding: 24px 16px; }
        }
      `}</style>

      <div className="page">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="content">
          <div className="badge">
            <div className="badge-dot" />
            Ralis AI Initiative
          </div>

          <span className="icon">📄</span>
          <h1>DocHelper</h1>

          <p className="tagline">
            Smart document intake for modern teams.<br />
            Clients scan on their phone. You get clean PDFs.
          </p>

          <div className="buttons">
            <a href="/create" className="btn-primary">
              ➕ New Document Request
            </a>
            <a href="/dashboard" className="btn-secondary">
              📊 Processor Dashboard
            </a>
          </div>

          <div className="steps">
            <div className="steps-title">How it works</div>
            {[
              { n: '01', title: 'Create a request', desc: 'Enter client email, case ID, and required documents' },
              { n: '02', title: 'Send the link', desc: 'Client receives a secure link — no login required' },
              { n: '03', title: 'Client scans on phone', desc: 'Documents captured with live camera, no app needed' },
              { n: '04', title: 'Download clean PDF', desc: 'Processor receives organized PDFs ready to file' }
            ].map((s, i) => (
              <div className="step" key={i}>
                <div className="step-num">{s.n}</div>
                <div className="step-text">
                  <strong>{s.title}</strong>
                  <span>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="footer">Built by Ralis Services · AI Demo Initiative · 2026</p>
        </div>
      </div>
    </>
  )
}
