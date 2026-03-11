import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Canchas() {
  const [canchas, setCanchas] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    axios.get('http://localhost:3000/api/canchas')
      .then(res => setCanchas(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const tipoIcono = (tipo) => {
    const iconos = { futbol11: '⚽', futbol7: '⚽', futbol5: '⚽', tenis: '🎾' }
    return iconos[tipo] || '🏟️'
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',fontFamily:'Segoe UI'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <span style={{color:'#fff',fontSize:'20px',fontWeight:'700',cursor:'pointer'}} onClick={() => navigate('/dashboard')}>⚽ CanchasApp</span>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <span style={{color:'rgba(255,255,255,0.7)',fontSize:'14px'}}>👤 {user.nombre}</span>
          <button style={{padding:'8px 16px',background:'rgba(255,80,80,0.2)',border:'1px solid rgba(255,80,80,0.3)',borderRadius:'8px',color:'#ff6b6b',cursor:'pointer',fontSize:'14px'}} onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>

      <div style={{padding:'40px'}}>
        <h1 style={{color:'#fff',fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>Canchas Disponibles</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'40px'}}>Seleccioná una cancha para reservar</p>

        {loading ? (
          <p style={{color:'#fff',textAlign:'center'}}>Cargando canchas...</p>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'24px'}}>
            {canchas.map(cancha => (
              <div key={cancha.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'24px',cursor:'pointer',transition:'transform 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
                onClick={() => navigate(`/reservar/${cancha.id}`)}>
                <div style={{fontSize:'48px',marginBottom:'12px'}}>{tipoIcono(cancha.tipo)}</div>
                <h3 style={{color:'#fff',fontSize:'18px',fontWeight:'700',marginBottom:'8px'}}>{cancha.nombre}</h3>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',marginBottom:'16px'}}>{cancha.descripcion}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{color:'#00d4ff',fontWeight:'700',fontSize:'18px'}}>₡{cancha.precio_hora.toLocaleString()}/hr</span>
                  <span style={{background:'rgba(0,212,255,0.1)',border:'1px solid rgba(0,212,255,0.3)',color:'#00d4ff',padding:'4px 12px',borderRadius:'20px',fontSize:'12px'}}>Disponible</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}