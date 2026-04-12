import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

export default function GestionarCanchas() {
  const [canchas, setCanchas] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', tipo: 'futbol11', precio_hora: '' })
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    cargarCanchas()
  }, [])

const cargarCanchas = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/canchas/todas`)
      setCanchas(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGuardar = async () => {
    try {
      if (editando) {
        await axios.put(`${API_URL}/api/canchas/${editando.id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post(`${API_URL}/api/canchas`, form, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setMostrarForm(false)
      setEditando(null)
      setForm({ nombre: '', descripcion: '', tipo: 'futbol11', precio_hora: '' })
      cargarCanchas()
    } catch (err) {
      alert('Error al guardar la cancha')
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('Estas seguro de eliminar esta cancha?')) return
    try {
      await axios.delete(`${API_URL}/api/canchas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      cargarCanchas()
    } catch (err) {
      alert('Error al eliminar la cancha')
    }
  }

  const handleMantenimiento = async (cancha) => {
    try {
      await axios.put(`${API_URL}/api/canchas/${cancha.id}`, {
        ...cancha,
        disponible: !cancha.disponible
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      cargarCanchas()
    } catch (err) {
      alert('Error al cambiar estado')
    }
  }

  const handleEditar = (cancha) => {
    setEditando(cancha)
    setForm({ nombre: cancha.nombre, descripcion: cancha.descripcion, tipo: cancha.tipo, precio_hora: cancha.precio_hora })
    setMostrarForm(true)
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',fontFamily:'Segoe UI'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <span style={{color:'#fff',fontSize:'20px',fontWeight:'700',cursor:'pointer'}} onClick={() => navigate('/panel-propietario')}>CanchasApp</span>
        <button onClick={() => navigate('/panel-propietario')} style={{background:'none',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.7)',padding:'8px 16px',borderRadius:'8px',cursor:'pointer'}}>Volver</button>
      </div>

      <div style={{padding:'40px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px'}}>
          <h1 style={{color:'#fff',fontSize:'32px',fontWeight:'700'}}>Gestionar Canchas</h1>
          <button onClick={() => { setMostrarForm(true); setEditando(null); setForm({ nombre: '', descripcion: '', tipo: 'futbol11', precio_hora: '' }) }}
            style={{background:'linear-gradient(135deg,#00d4ff,#0099cc)',border:'none',borderRadius:'12px',color:'#fff',padding:'12px 24px',fontSize:'15px',cursor:'pointer',fontWeight:'600'}}>
            + Nueva Cancha
          </button>
        </div>

        {mostrarForm && (
          <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'32px',marginBottom:'32px'}}>
            <h3 style={{color:'#fff',marginBottom:'24px'}}>{editando ? 'Editar Cancha' : 'Nueva Cancha'}</h3>
            <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
              style={{width:'100%',padding:'12px',marginBottom:'12px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}} />
            <input placeholder="Descripcion" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}
              style={{width:'100%',padding:'12px',marginBottom:'12px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}} />
            <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
              style={{width:'100%',padding:'12px',marginBottom:'12px',background:'#1a1a2e',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}}>
              <option value="futbol11">Futbol 11</option>
              <option value="futbol7">Futbol 7</option>
              <option value="futbol5">Futbol 5</option>
              <option value="tenis">Tenis</option>
            </select>
            <input placeholder="Precio por hora" type="number" value={form.precio_hora} onChange={e => setForm({...form, precio_hora: e.target.value})}
              style={{width:'100%',padding:'12px',marginBottom:'16px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}} />
            <div style={{display:'flex',gap:'12px'}}>
              <button onClick={handleGuardar} style={{background:'linear-gradient(135deg,#00d4ff,#0099cc)',border:'none',borderRadius:'8px',color:'#fff',padding:'10px 24px',cursor:'pointer',fontWeight:'600'}}>Guardar</button>
              <button onClick={() => setMostrarForm(false)} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'8px',color:'#fff',padding:'10px 24px',cursor:'pointer'}}>Cancelar</button>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{color:'#fff'}}>Cargando...</p>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {canchas.map(cancha => (
              <div key={cancha.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <h3 style={{color:'#fff',fontSize:'18px',fontWeight:'700',marginBottom:'4px'}}>{cancha.nombre}</h3>
                  <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',marginBottom:'4px'}}>{cancha.descripcion}</p>
                  <p style={{color:'#00d4ff',fontWeight:'700'}}>C{cancha.precio_hora.toLocaleString()}/hr</p>
                </div>
                <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                  <span style={{background: cancha.disponible ? 'rgba(0,212,100,0.1)' : 'rgba(255,200,0,0.1)', border: cancha.disponible ? '1px solid rgba(0,212,100,0.3)' : '1px solid rgba(255,200,0,0.3)', color: cancha.disponible ? '#00d464' : '#ffc800', padding:'4px 12px',borderRadius:'20px',fontSize:'13px'}}>
                    {cancha.disponible ? 'Disponible' : 'Mantenimiento'}
                  </span>
                  <button onClick={() => handleMantenimiento(cancha)} style={{background:'rgba(255,200,0,0.1)',border:'1px solid rgba(255,200,0,0.3)',color:'#ffc800',padding:'6px 14px',borderRadius:'8px',cursor:'pointer',fontSize:'13px'}}>
                    {cancha.disponible ? 'Mantenimiento' : 'Activar'}
                  </button>
                  <button onClick={() => handleEditar(cancha)} style={{background:'rgba(0,212,255,0.1)',border:'1px solid rgba(0,212,255,0.3)',color:'#00d4ff',padding:'6px 14px',borderRadius:'8px',cursor:'pointer',fontSize:'13px'}}>Editar</button>
                  <button onClick={() => handleEliminar(cancha.id)} style={{background:'rgba(255,80,80,0.1)',border:'1px solid rgba(255,80,80,0.3)',color:'#ff6b6b',padding:'6px 14px',borderRadius:'8px',cursor:'pointer',fontSize:'13px'}}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}