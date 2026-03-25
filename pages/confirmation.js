import { useRouter } from 'next/router'

export default function Confirmation() {
  const router = useRouter()
  const { id, email } = router.query
  const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/request/${id}`

  const copyLink = () => {
    navigator.clipboard.writeText(link)
    alert('Link copied to clipboard!')
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>📄 DocHelper</h1>
      <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
        <h2 style={{ color: '#16a34a', marginTop: 0 }}>✅ Request Created!</h2>
        <p>Send this link to <strong>{email}</strong>:</p>
        <div style={{ background: 'white', border: '1px solid #ccc', borderRadius: '6px', padding: '12px', wordBreak: 'break-all', fontSize: '14px' }}>
          {link}
        </div>
        <button
          onClick={copyLink}
          style={{ marginTop: '12px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
        >📋 Copy Link</button>
      </div>
      <button
        onClick={() => router.push('/create')}
        style={{ padding: '10px 20px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
      >+ New Request</button>
    </div>
  )
}
