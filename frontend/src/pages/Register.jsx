import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'usuario' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleRegister = async () => {
    setLoading(true)
    setError('')
    try {
      await axios.post(`${API_URL}/api/auth/register`, form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'24px',padding:'48px 40px',width:'100%',maxWidth:'400px',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{fontSize:'48px'}}>⚽</div>
        <h1 style={{color:'#fff',fontSize:'28px',margin:'0 0 4px'}}>CanchasApp</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'32px'}}>Creá tu cuenta</p>
        {error && <div style={{color:'#ff6b6b',marginBottom:'16px'}}>{error}</div>}
        <input style={{width:'100%',padding:'14px',marginBottom:'16px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'12px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}} name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={handleChange} />
        <input style={{width:'100%',padding:'14px',marginBottom:'16px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'12px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}} name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} />
        <input style={{width:'100%',padding:'14px',marginBottom:'16px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'12px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}} name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
        <button style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#00d4ff,#0099cc)',border:'none',borderRadius:'12px',color:'#fff',fontSize:'16px',fontWeight:'600',cursor:'pointer'}} onClick={handleRegister} disabled={loading}>{loading?'Registrando...':'Crear Cuenta'}</button>
        <p style={{color:'rgba(255,255,255,0.5)',marginTop:'24px'}}>¿Ya tenés cuenta? <Link to="/login" style={{color:'#00d4ff'}}>Iniciá sesión</Link></p>
      </div>
    </div>
  )
}