import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

export default function PanelAdmin() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todas')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    cargarReservas()
  }, [])

  const cargarReservas = () => {
    axios.get(`${API_URL}/api/reservas/todas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setReservas(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const confirmarPago = async (id) => {
    try {
      await axios.put(`${API_URL}/api/reservas/confirmar-pago/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      cargarReservas()
      alert('Pago confirmado exitosamente')
    } catch (err) {
      alert('Error al confirmar pago')
    }
  }

  const reservasFiltradas = reservas.filter(r => {
    if (filtro === 'todas') return true
    if (filtro === 'sin_pago') return !r.tipo_pago || r.tipo_pago === 'pendiente'
    if (filtro === 'sinpe') return r.tipo_pago === 'sinpe'
    if (filtro === 'efectivo') return r.tipo_pago === 'efectivo'
    if (filtro === 'tarjeta') return r.tipo_pago === 'tarjeta'
    return true
  })

  const tipoPagoColor = (tipo) => {
    if (tipo === 'tarjeta') return { color: '#00d4ff', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.3)' }
    if (tipo === 'sinpe') return { color: '#ffc800', bg: 'rgba(255,200,0,0.1)', border: 'rgba(255,200,0,0.3)' }
    if (tipo === 'efectivo') return { color: '#00d464', bg: 'rgba(0,212,100,0.1)', border: 'rgba(0,212,100,0.3)' }
    return { color: '#ff6b6b', bg: 'rgba(255,80,80,0.1)', border: 'rgba(255,80,80,0.3)' }
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',fontFamily:'Segoe UI'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <span style={{color:'#fff',fontSize:'20px',fontWeight:'700',cursor:'pointer'}} onClick={() => navigate('/dashboard')}>CanchasApp</span>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <span style={{color:'rgba(255,255,255,0.7)',fontSize:'14px'}}>{user.nombre}</span>
          <button style={{padding:'8px 16px',background:'rgba(255,80,80,0.2)',border:'1px solid rgba(255,80,80,0.3)',borderRadius:'8px',color:'#ff6b6b',cursor:'pointer',fontSize:'14px'}} onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login') }}>Cerrar Sesion</button>
        </div>
      </div>

      <div style={{padding:'40px'}}>
        <h1 style={{color:'#fff',fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>Panel Administrador</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'32px'}}>Gestion de pagos y reservas</p>

        <div style={{display:'flex',gap:'12px',marginBottom:'32px',flexWrap:'wrap'}}>
          {[
            {key:'todas', label:'Todas'},
            {key:'sin_pago', label:'Sin Pago'},
            {key:'sinpe', label:'SINPE'},
            {key:'efectivo', label:'Efectivo'},
            {key:'tarjeta', label:'Tarjeta'}
          ].map(f => (
            <button key={f.key} onClick={() => setFiltro(f.key)}
              style={{padding:'8px 20px',borderRadius:'20px',border:'1px solid rgba(255,255,255,0.2)',background: filtro === f.key ? 'rgba(0,212,255,0.2)' : 'transparent',color: filtro === f.key ? '#00d4ff' : 'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:'14px'}}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{color:'#fff'}}>Cargando...</p>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px',maxWidth:'900px'}}>
            {reservasFiltradas.map(reserva => {
              const tipoPago = reserva.tipo_pago || 'sin pago'
              const coloresTipo = tipoPagoColor(reserva.tipo_pago)
              return (
                <div key={reserva.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'24px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div>
                      <h3 style={{color:'#fff',fontSize:'16px',fontWeight:'700',marginBottom:'4px'}}>{reserva.canchas?.nombre}</h3>
                      <p style={{color:'rgba(255,255,255,0.7)',fontSize:'13px',marginBottom:'4px'}}>Usuario: {reserva.usuarios?.nombre} - {reserva.usuarios?.email}</p>
                      <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'4px'}}>{reserva.fecha} | {reserva.hora_inicio} - {reserva.hora_fin}</p>
                      <p style={{color:'#00d4ff',fontWeight:'700',fontSize:'16px',marginBottom:'8px'}}>C{Number(reserva.total).toLocaleString()}</p>
                      <span style={{background:coloresTipo.bg,border:`1px solid ${coloresTipo.border}`,color:coloresTipo.color,padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'600'}}>
                        {tipoPago === 'sin pago' ? 'Sin pago' : tipoPago}
                      </span>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'8px',alignItems:'flex-end'}}>
                      {reserva.comprobante_url && (
                        <a href={reserva.comprobante_url} target="_blank" style={{background:'rgba(255,200,0,0.1)',border:'1px solid rgba(255,200,0,0.3)',color:'#ffc800',padding:'6px 14px',borderRadius:'8px',fontSize:'13px',textDecoration:'none'}}>
                          Ver comprobante SINPE
                        </a>
                      )}
                      {(reserva.tipo_pago === 'sinpe' || reserva.tipo_pago === 'efectivo') && reserva.estado !== 'cancelada' && (
                        <button onClick={() => confirmarPago(reserva.id)}
                          style={{background:'rgba(0,212,100,0.1)',border:'1px solid rgba(0,212,100,0.3)',color:'#00d464',padding:'6px 14px',borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:'600'}}>
                          Confirmar Pago
                        </button>
                      )}
                    </div>
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