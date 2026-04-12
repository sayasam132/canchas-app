import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

export default function TodasReservas() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get(`${API_URL}/api/reservas/todas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setReservas(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

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
        <span style={{color:'#fff',fontSize:'20px',fontWeight:'700',cursor:'pointer'}} onClick={() => navigate('/panel-propietario')}>CanchasApp</span>
        <button onClick={() => navigate('/panel-propietario')} style={{background:'none',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.7)',padding:'8px 16px',borderRadius:'8px',cursor:'pointer'}}>Volver</button>
      </div>

      <div style={{padding:'40px'}}>
        <h1 style={{color:'#fff',fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>Todas las Reservas</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'40px'}}>Reservas de todos los usuarios</p>

        {loading ? (
          <p style={{color:'#fff'}}>Cargando...</p>
        ) : reservas.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px'}}>
            <div style={{fontSize:'64px',marginBottom:'16px'}}>📋</div>
            <h3 style={{color:'#fff'}}>No hay reservas aun</h3>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px',maxWidth:'900px'}}>
            {reservas.map(reserva => {
              const colores = estadoColor(reserva.estado)
              return (
                <div key={reserva.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <h3 style={{color:'#fff',fontSize:'18px',fontWeight:'700',marginBottom:'4px'}}>{reserva.canchas?.nombre}</h3>
                    <p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',marginBottom:'4px'}}>Usuario: {reserva.usuarios?.nombre} - {reserva.usuarios?.email}</p>
                    <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',marginBottom:'4px'}}>Fecha: {reserva.fecha} | {reserva.hora_inicio} - {reserva.hora_fin}</p>
                    <p style={{color:'#00d4ff',fontWeight:'700'}}>Total: C{Number(reserva.total).toLocaleString()}</p>
                  </div>
                  <span style={{background:colores.bg,border:`1px solid ${colores.border}`,color:colores.color,padding:'4px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'600'}}>{reserva.estado}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}