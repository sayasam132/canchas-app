import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError('Credenciales inválidas. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>⚽</div>
        <h1 style={styles.title}>CanchasApp</h1>
        <p style={styles.subtitle}>Iniciá sesión para reservar</p>
        {error && <div style={styles.error}>{error}</div>}
        <input style={styles.input} type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.button} onClick={handleLogin} disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
        <p style={styles.link}>
          ¿No tenés cuenta? <Link to="/register" style={styles.linkText}>Registrate</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px', padding: '48px 40px',
    width: '100%', maxWidth: '400px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  },
  logo: { fontSize: '48px', marginBottom: '8px' },
  title: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: '0 0 4px' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px' },
  error: {
    background: 'rgba(255,80,80,0.15)',
    border: '1px solid rgba(255,80,80,0.3)',
    color: '#ff6b6b', borderRadius: '8px',
    padding: '10px 16px', marginBottom: '16px',
    width: '100%', textAlign: 'center', fontSize: '14px',
  },
  input: {
    width: '100%', padding: '14px 16px', marginBottom: '16px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px', color: '#fff', fontSize: '15px',
    outline: 'none', boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
    border: 'none', borderRadius: '12px',
    color: '#fff', fontSize: '16px', fontWeight: '600',
    cursor: 'pointer', marginTop: '8px',
  },
  link: { color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '24px' },
  linkText: { color: '#00d4ff', textDecoration: 'none', fontWeight: '600' },
}