import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function MisReservas() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get('http://localhost:3000/api/reservas/mis-reservas', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setReservas(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleCancelar = async (id) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return
    try {
      await axios.put(`http://localhost:3000/api/reservas/cancelar/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReservas(reservas.map(r => r.id === id ? { ...r, estado: 'cancelada' } : r))
    } catch (err) {
      alert('Error al cancelar la reserva')
    }
  }

  const estadoColor = (estado) => {
    const colores = {
      confirmada: { bg: 'rgba(0,212,100,0.1)', border: 'rgba(0,212,100,0.3)', color: '#00d464' },
      pendiente: { bg: 'rgba(255,200,0,0.1)', border: 'rgba(255,200,0,0.3)', color: '#ffc800' },
      cancelada: { bg: 'rgba(255,80,80,0.1)', border: 'rgba(255,80,80,0.3)', color: '#ff6b6b' },
    }
    return colores[estado] || colores.pendiente
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',fontFamily:'Segoe UI'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <span style={{color:'#fff',fontSize:'20px',fontWeight:'700',cursor:'pointer'}} onClick={() => navigate('/dashboard')}>⚽ CanchasApp</span>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <span style={{color:'rgba(255,255,255,0.7)',fontSize:'14px'}}>👤 {user.nombre}</span>
          <button style={{padding:'8px 16px',background:'rgba(255,80,80,0.2)',border:'1px solid rgba(255,80,80,0.3)',borderRadius:'8px',color:'#ff6b6b',cursor:'pointer',fontSize:'14px'}} onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login') }}>Cerrar Sesión</button>
        </div>
      </div>

      <div style={{padding:'40px'}}>
        <h1 style={{color:'#fff',fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>Mis Reservas</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'40px'}}>Historial de tus reservas</p>

        {loading ? (
          <p style={{color:'#fff',textAlign:'center'}}>Cargando reservas...</p>
        ) : reservas.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px'}}>
            <div style={{fontSize:'64px',marginBottom:'16px'}}>📅</div>
            <h3 style={{color:'#fff',marginBottom:'8px'}}>No tenés reservas aún</h3>
            <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'24px'}}>¡Reservá una cancha ahora!</p>
            <button onClick={() => navigate('/canchas')} style={{background:'linear-gradient(135deg,#00d4ff,#0099cc)',border:'none',borderRadius:'12px',color:'#fff',padding:'12px 24px',fontSize:'16px',cursor:'pointer'}}>Ver Canchas</button>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px',maxWidth:'800px'}}>
            {reservas.map(reserva => {
              const colores = estadoColor(reserva.estado)
              return (
                <div key={reserva.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <h3 style={{color:'#fff',fontSize:'18px',fontWeight:'700',marginBottom:'4px'}}>{reserva.canchas?.nombre}</h3>
                    <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',marginBottom:'8px'}}>📅 {reserva.fecha} | ⏰ {reserva.hora_inicio} - {reserva.hora_fin}</p>
                    <p style={{color:'#00d4ff',fontWeight:'700'}}>₡{Number(reserva.total).toLocaleString()}</p>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'12px'}}>
                    <span style={{background:colores.bg,border:`1px solid ${colores.border}`,color:colores.color,padding:'4px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'600'}}>{reserva.estado}</span>
                    {reserva.estado !== 'cancelada' && (
                      <button onClick={() => handleCancelar(reserva.id)} style={{background:'rgba(255,80,80,0.1)',border:'1px solid rgba(255,80,80,0.3)',color:'#ff6b6b',padding:'6px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'13px'}}>Cancelar</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}