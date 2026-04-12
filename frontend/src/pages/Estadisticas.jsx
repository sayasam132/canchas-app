import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

export default function Estadisticas() {
  const [reporte, setReporte] = useState(null)
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/reportes/ingresos`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_URL}/api/reservas/todas`, { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([reporteRes, reservasRes]) => {
        setReporte(reporteRes.data)
        setReservas(reservasRes.data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const totalCanceladas = reservas.filter(r => r.estado === 'cancelada').length
  const totalConfirmadas = reservas.filter(r => r.estado === 'confirmada').length
  const totalReservas = reservas.length

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',fontFamily:'Segoe UI'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <span style={{color:'#fff',fontSize:'20px',fontWeight:'700',cursor:'pointer'}} onClick={() => navigate('/panel-propietario')}>CanchasApp</span>
        <button onClick={() => navigate('/panel-propietario')} style={{background:'none',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.7)',padding:'8px 16px',borderRadius:'8px',cursor:'pointer'}}>Volver</button>
      </div>

      <div style={{padding:'40px'}}>
        <h1 style={{color:'#fff',fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>Estadisticas</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'40px'}}>Rendimiento y estadisticas generales</p>

        {loading ? (
          <p style={{color:'#fff'}}>Cargando...</p>
        ) : reporte && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'24px',marginBottom:'40px'}}>
              <div style={{background:'rgba(0,212,255,0.1)',border:'1px solid rgba(0,212,255,0.2)',borderRadius:'16px',padding:'24px',textAlign:'center'}}>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'8px'}}>Total Ingresos</p>
                <p style={{color:'#00d4ff',fontSize:'28px',fontWeight:'700'}}>C{reporte.totalIngresos.toLocaleString()}</p>
              </div>
              <div style={{background:'rgba(0,212,100,0.1)',border:'1px solid rgba(0,212,100,0.2)',borderRadius:'16px',padding:'24px',textAlign:'center'}}>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'8px'}}>Reservas Confirmadas</p>
                <p style={{color:'#00d464',fontSize:'28px',fontWeight:'700'}}>{totalConfirmadas}</p>
              </div>
              <div style={{background:'rgba(255,80,80,0.1)',border:'1px solid rgba(255,80,80,0.2)',borderRadius:'16px',padding:'24px',textAlign:'center'}}>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'8px'}}>Reservas Canceladas</p>
                <p style={{color:'#ff6b6b',fontSize:'28px',fontWeight:'700'}}>{totalCanceladas}</p>
              </div>
              <div style={{background:'rgba(255,200,0,0.1)',border:'1px solid rgba(255,200,0,0.2)',borderRadius:'16px',padding:'24px',textAlign:'center'}}>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'8px'}}>Total Reservas</p>
                <p style={{color:'#ffc800',fontSize:'28px',fontWeight:'700'}}>{totalReservas}</p>
              </div>
            </div>

            <h2 style={{color:'#fff',fontSize:'20px',fontWeight:'700',marginBottom:'16px'}}>Ingresos por Cancha</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'12px',maxWidth:'700px'}}>
              {Object.entries(reporte.porCancha).map(([nombre, data]) => {
                const porcentaje = reporte.totalIngresos > 0 ? (data.ingresos / reporte.totalIngresos * 100).toFixed(1) : 0
                return (
                  <div key={nombre} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'20px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                      <div>
                        <h3 style={{color:'#fff',fontSize:'16px',fontWeight:'700',marginBottom:'4px'}}>{nombre}</h3>
                        <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px'}}>{data.reservas} reservas</p>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <p style={{color:'#00d4ff',fontSize:'18px',fontWeight:'700'}}>C{data.ingresos.toLocaleString()}</p>
                        <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px'}}>{porcentaje}% del total</p>
                      </div>
                    </div>
                    <div style={{background:'rgba(255,255,255,0.1)',borderRadius:'4px',height:'6px'}}>
                      <div style={{background:'linear-gradient(135deg,#00d4ff,#0099cc)',borderRadius:'4px',height:'6px',width:`${porcentaje}%`}}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}