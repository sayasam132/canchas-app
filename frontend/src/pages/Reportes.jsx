import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

export default function Reportes() {
  const [reporte, setReporte] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get(`${API_URL}/api/reportes/ingresos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setReporte(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

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
        <h1 style={{color:'#fff',fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>📊 Reportes</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'40px'}}>Resumen de ingresos y ocupación</p>

        {loading ? (
          <p style={{color:'#fff',textAlign:'center'}}>Cargando reportes...</p>
        ) : reporte && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'24px',maxWidth:'700px',marginBottom:'40px'}}>
              <div style={{background:'rgba(0,212,255,0.1)',border:'1px solid rgba(0,212,255,0.2)',borderRadius:'16px',padding:'32px',textAlign:'center'}}>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',marginBottom:'8px'}}>Total Ingresos</p>
                <p style={{color:'#00d4ff',fontSize:'36px',fontWeight:'700'}}>₡{reporte.totalIngresos.toLocaleString()}</p>
              </div>
              <div style={{background:'rgba(0,212,100,0.1)',border:'1px solid rgba(0,212,100,0.2)',borderRadius:'16px',padding:'32px',textAlign:'center'}}>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',marginBottom:'8px'}}>Total Reservas</p>
                <p style={{color:'#00d464',fontSize:'36px',fontWeight:'700'}}>{reporte.totalReservas}</p>
              </div>
            </div>

            <h2 style={{color:'#fff',fontSize:'20px',fontWeight:'700',marginBottom:'16px'}}>Ingresos por Cancha</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'12px',maxWidth:'700px'}}>
              {Object.entries(reporte.porCancha).map(([nombre, data]) => (
                <div key={nombre} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <h3 style={{color:'#fff',fontSize:'16px',fontWeight:'700',marginBottom:'4px'}}>{nombre}</h3>
                    <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px'}}>{data.reservas} reservas</p>
                  </div>
                  <span style={{color:'#00d4ff',fontSize:'20px',fontWeight:'700'}}>₡{data.ingresos.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}