import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { supabase } from '../supabaseClient'
import API_URL from '../config'

export default function MisReservas() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalPago, setModalPago] = useState(null)
  const [comprobante, setComprobante] = useState(null)
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    cargarReservas()
  }, [])

  const cargarReservas = () => {
    axios.get(`${API_URL}/api/reservas/mis-reservas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setReservas(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const handleCancelar = async (id) => {
    if (!confirm('Estas seguro de cancelar esta reserva?')) return
    try {
      await axios.put(`${API_URL}/api/reservas/cancelar/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReservas(reservas.map(r => r.id === id ? { ...r, estado: 'cancelada' } : r))
    } catch (err) {
      alert('Error al cancelar la reserva')
    }
  }

  const handlePagarTarjeta = async (reserva) => {
    try {
      const res = await axios.post(`${API_URL}/api/pagos/crear-sesion`, {
        cancha_nombre: reserva.canchas?.nombre,
        total: reserva.total,
        reserva_id: reserva.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      window.location.href = res.data.url
    } catch (err) {
      alert('Error al procesar el pago')
    }
  }

  const handlePagarEfectivo = async (reserva) => {
    try {
      await axios.post(`${API_URL}/api/pagos/efectivo`, {
        reserva_id: reserva.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setModalPago(null)
      alert('Pago en efectivo registrado. Presenta este comprobante el dia de tu reserva.')
      cargarReservas()
    } catch (err) {
      alert('Error al registrar pago en efectivo')
    }
  }

  const handleSubirSinpe = async (reserva) => {
    if (!comprobante) {
      alert('Selecciona una foto del comprobante')
      return
    }
    setSubiendoFoto(true)
    try {
      const fileName = `sinpe_${reserva.id}_${Date.now()}.jpg`
      const { data, error } = await supabase.storage
        .from('comprobantes')
        .upload(fileName, comprobante)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('comprobantes')
        .getPublicUrl(fileName)

      await axios.post(`${API_URL}/api/pagos/sinpe`, {
        reserva_id: reserva.id,
        comprobante_url: urlData.publicUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setModalPago(null)
      setComprobante(null)
      alert('Comprobante SINPE enviado exitosamente')
      cargarReservas()
    } catch (err) {
      alert('Error al subir comprobante')
    } finally {
      setSubiendoFoto(false)
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
        <span style={{color:'#fff',fontSize:'20px',fontWeight:'700',cursor:'pointer'}} onClick={() => navigate('/dashboard')}>CanchasApp</span>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <span style={{color:'rgba(255,255,255,0.7)',fontSize:'14px'}}>{user.nombre}</span>
          <button style={{padding:'8px 16px',background:'rgba(255,80,80,0.2)',border:'1px solid rgba(255,80,80,0.3)',borderRadius:'8px',color:'#ff6b6b',cursor:'pointer',fontSize:'14px'}} onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login') }}>Cerrar Sesion</button>
        </div>
      </div>

      {modalPago && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#1a1a2e',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'32px',maxWidth:'400px',width:'90%'}}>
            <h3 style={{color:'#fff',marginBottom:'8px'}}>Selecciona metodo de pago</h3>
            <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',marginBottom:'24px'}}>{modalPago.canchas?.nombre} - C{Number(modalPago.total).toLocaleString()}</p>
            
            <button onClick={() => handlePagarTarjeta(modalPago)} style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#00d4ff,#0099cc)',border:'none',borderRadius:'12px',color:'#fff',fontSize:'15px',cursor:'pointer',fontWeight:'600',marginBottom:'12px'}}>
              💳 Pagar con Tarjeta
            </button>

            <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'16px',marginBottom:'12px'}}>
              <p style={{color:'#fff',fontWeight:'600',marginBottom:'8px'}}>📱 Pagar con SINPE</p>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'12px'}}>Numero SINPE: <strong style={{color:'#00d4ff'}}>8888-8888</strong></p>
              <input type="file" accept="image/*" onChange={e => setComprobante(e.target.files[0])}
                style={{width:'100%',padding:'8px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',color:'#fff',fontSize:'13px',boxSizing:'border-box',marginBottom:'8px'}} />
              <button onClick={() => handleSubirSinpe(modalPago)} disabled={subiendoFoto}
                style={{width:'100%',padding:'10px',background:'rgba(0,212,255,0.1)',border:'1px solid rgba(0,212,255,0.3)',borderRadius:'8px',color:'#00d4ff',fontSize:'14px',cursor:'pointer',fontWeight:'600'}}>
                {subiendoFoto ? 'Subiendo...' : 'Enviar Comprobante'}
              </button>
            </div>

            <button onClick={() => handlePagarEfectivo(modalPago)} style={{width:'100%',padding:'14px',background:'rgba(0,212,100,0.1)',border:'1px solid rgba(0,212,100,0.3)',borderRadius:'12px',color:'#00d464',fontSize:'15px',cursor:'pointer',fontWeight:'600',marginBottom:'12px'}}>
              💵 Pagar en Efectivo
            </button>

            <button onClick={() => setModalPago(null)} style={{width:'100%',padding:'10px',background:'transparent',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'8px',color:'rgba(255,255,255,0.5)',fontSize:'14px',cursor:'pointer'}}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={{padding:'40px'}}>
        <h1 style={{color:'#fff',fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>Mis Reservas</h1>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'40px'}}>Historial de tus reservas</p>

        {loading ? (
          <p style={{color:'#fff',textAlign:'center'}}>Cargando reservas...</p>
        ) : reservas.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px'}}>
            <div style={{fontSize:'64px',marginBottom:'16px'}}>📅</div>
            <h3 style={{color:'#fff',marginBottom:'8px'}}>No tenes reservas aun</h3>
            <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'24px'}}>Reserva una cancha ahora!</p>
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
                    <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',marginBottom:'8px'}}>📅 {reserva.fecha} | {reserva.hora_inicio} - {reserva.hora_fin}</p>
                    <p style={{color:'#00d4ff',fontWeight:'700'}}>C{Number(reserva.total).toLocaleString()}</p>
                    {reserva.tipo_pago && reserva.tipo_pago !== 'pendiente' && (
                      <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginTop:'4px'}}>Pago: {reserva.tipo_pago}</p>
                    )}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'12px'}}>
                    <span style={{background:colores.bg,border:`1px solid ${colores.border}`,color:colores.color,padding:'4px 16px',borderRadius:'20px',fontSize:'13px',fontWeight:'600'}}>{reserva.estado}</span>
                    {reserva.estado !== 'cancelada' && (
                      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                        <button onClick={() => setModalPago(reserva)} style={{background:'linear-gradient(135deg,#00d4ff,#0099cc)',border:'none',color:'#fff',padding:'6px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:'600'}}>Pagar</button>
                        <button onClick={() => handleCancelar(reserva.id)} style={{background:'rgba(255,80,80,0.1)',border:'1px solid rgba(255,80,80,0.3)',color:'#ff6b6b',padding:'6px 16px',borderRadius:'8px',cursor:'pointer',fontSize:'13px'}}>Cancelar</button>
                      </div>
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