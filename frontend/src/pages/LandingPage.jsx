import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <h1 style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text)', marginBottom: '16px', letterSpacing: '-1px' }}>
        Creator<span style={{ color: 'var(--accent)' }}>Start</span>
      </h1>
      <p style={{ fontSize: '18px', color: 'var(--muted)', marginBottom: '40px', textAlign: 'center', maxWidth: '500px' }}>
        Plan smarter. Grow faster. Your all-in-one content platform for YouTube & Instagram creators.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => navigate('/auth')} style={{ padding: '12px 28px', borderRadius: '10px', background: 'var(--accent)', border: 'none', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
          Get Started
        </button>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 28px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
          View Demo
        </button>
      </div>
    </div>
  )
}