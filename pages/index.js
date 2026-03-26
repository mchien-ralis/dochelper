export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>

        {/* Logo */}
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
        <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#1e3a5f', margin: '0 0 8px 0' }}>DocHelper</h1>
        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '48px' }}>
          Smart document intake for modern teams.<br />
          <span style={{ fontSize: '14px' }}>Scan · Submit · Done.</span>
        </p>

        {/* Main Actions */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '48px', flexDirection: 'column' }}>
          <a href="/create" style={{
            display: 'block', padding: '18px 32px',
            background: '#2563eb', color: 'white',
            borderRadius: '12px', textDecoration: 'none',
            fontSize: '18px', fontWeight: '600',
            boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
            transition: 'transform 0.1s'
          }}>
            ➕ New Document Request
          </a>
          <a href="/dashboard" style={{
            display: 'block', padding: '18px 32px',
            background: 'white', color: '#1e3a5f',
            borderRadius: '12px', textDecoration: 'none',
            fontSize: '18px', fontWeight: '600',
            border: '2px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            📊 Processor Dashboard
          </a>
        </div>

        {/* How it works */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #e5e7eb', textAlign: 'left' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#374151', marginTop: 0, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>How it works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '1️⃣', title: 'Create a request', desc: 'Enter client email, case ID, and list of required documents' },
              { icon: '2️⃣', title: 'Send the link', desc: 'Client receives a secure link — no login required' },
              { icon: '3️⃣', title: 'Client scans', desc: 'Client opens link on phone and scans each document' },
              { icon: '4️⃣', title: 'Download PDF', desc: 'Processor receives clean PDFs ready to file' }
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '24px', minWidth: '32px' }}>{step.icon}</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#1e3a5f', marginBottom: '2px' }}>{step.title}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ marginTop: '24px', fontSize: '12px', color: '#9ca3af' }}>
          Built by Ralis Services · AI Demo Initiative
        </p>
      </div>
    </div>
  )
}
