import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

export default function GestionarAdmins() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    cargarAdmins()
  }, [])

  const cargarAdmins = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAdmins(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCrear = async () => {
    if (!form.nombre || !form.email || !form.password) {
      alert('Completa todos los campos')
      return
    }
    try {
      await axios.post(`${API_URL}/api/admins`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMostrarForm(false)
      setForm({ nombre: '', email: '', password: '' })
      cargarAdmins()
    } catch (err) {
      alert('Error al crear administrador')
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('Estas seguro de eliminar este administrador?')) return
    try {
      await axios.delete(`${API_URL}/api/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      cargarAdmins()
    } catch (err) {
      alert('Error al eliminar administrador')
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',fontFamily:'Segoe UI'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <span style={{color:'#fff',fontSize:'20px',fontWeight:'700',cursor:'pointer'}} onClick={() => navigate('/panel-propietario')}>CanchasApp</span>
        <button onClick={() => navigate('/panel-propietario')} style={{background:'none',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.7)',padding:'8px 16px',borderRadius:'8px',cursor:'pointer'}}>Volver</button>
      </div>

      <div style={{padding:'40px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px'}}>
          <h1 style={{color:'#fff',fontSize:'32px',fontWeight:'700'}}>Administradores</h1>
          <button onClick={() => setMostrarForm(true)}
            style={{background:'linear-gradient(135deg,#00d4ff,#0099cc)',border:'none',borderRadius:'12px',color:'#fff',padding:'12px 24px',fontSize:'15px',cursor:'pointer',fontWeight:'600'}}>
            + Nuevo Admin
          </button>
        </div>

        {mostrarForm && (
          <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'32px',marginBottom:'32px'}}>
            <h3 style={{color:'#fff',marginBottom:'24px'}}>Nuevo Administrador</h3>
            <input placeholder="Nombre completo" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
              style={{width:'100%',padding:'12px',marginBottom:'12px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}} />
            <input placeholder="Correo electronico" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              style={{width:'100%',padding:'12px',marginBottom:'12px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}} />
            <input placeholder="Contrasena" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              style={{width:'100%',padding:'12px',marginBottom:'16px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}} />
            <div style={{display:'flex',gap:'12px'}}>
              <button onClick={handleCrear} style={{background:'linear-gradient(135deg,#00d4ff,#0099cc)',border:'none',borderRadius:'8px',color:'#fff',padding:'10px 24px',cursor:'pointer',fontWeight:'600'}}>Crear</button>
              <button onClick={() => setMostrarForm(false)} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'8px',color:'#fff',padding:'10px 24px',cursor:'pointer'}}>Cancelar</button>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{color:'#fff'}}>Cargando...</p>
        ) : admins.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px'}}>
            <div style={{fontSize:'64px',marginBottom:'16px'}}>👥</div>
            <h3 style={{color:'#fff',marginBottom:'8px'}}>No hay administradores</h3>
            <p style={{color:'rgba(255,255,255,0.5)'}}>Crea el primer administrador</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px',maxWidth:'800px'}}>
            {admins.map(admin => (
              <div key={admin.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <h3 style={{color:'#fff',fontSize:'18px',fontWeight:'700',marginBottom:'4px'}}>{admin.nombre}</h3>
                  <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px'}}>{admin.email}</p>
                </div>
                <button onClick={() => handleEliminar(admin.id)} style={{background:'rgba(255,80,80,0.1)',border:'1px solid rgba(255,80,80,0.3)',color:'#ff6b6b',padding:'8px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}}>Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}