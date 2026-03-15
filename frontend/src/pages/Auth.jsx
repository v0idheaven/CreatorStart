import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabase'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })
      if (error) {
        setError(error.message)
      } else {
        await supabase.from('profiles').insert({
          id: data.user.id,
          name: name,
        })
        navigate('/select-platform')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px', width: '360px' }}>

        <h1 style={{ color: 'var(--text)', fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ color: 'var(--dim)', fontSize: '13px', marginBottom: '24px' }}>
          {isLogin ? 'Sign in to CreatorStart' : 'Start your creator journey'}
        </p>

        {!isLogin && (
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', background: '#18181b', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text)', fontSize: '13px', marginBottom: '10px', outline: 'none' }}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', background: '#18181b', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text)', fontSize: '13px', marginBottom: '10px', outline: 'none' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', background: '#18181b', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text)', fontSize: '13px', marginBottom: '16px', outline: 'none' }}
        />

        {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', background: 'var(--accent)', border: 'none', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}
        >
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>

        <p style={{ color: 'var(--dim)', fontSize: '12px', textAlign: 'center' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--accent)', cursor: 'pointer' }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>

      </div>
    </div>
  )
}

export default Auth