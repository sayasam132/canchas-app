import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

export default function Reservar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cancha, setCancha] = useState(null)
  const [fecha, setFecha] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFin, setHoraFin] = useState('')
  const [horasOcupadas, setHorasOcupadas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get(`${API_URL}/api/canchas/${id}`)
      .then(res => setCancha(res.data))
      .catch(() => navigate('/canchas'))
  }, [id])

  useEffect(() => {
    if (fecha) {
      setHoraInicio('')
      setHoraFin('')
      axios.get(`${API_URL}/api/canchas/${id}/horas-ocupadas?fecha=${fecha}`)
        .then(res => setHorasOcupadas(res.data))
        .catch(() => setHorasOcupadas([]))
    }
  }, [fecha])

  const calcularTotal = () => {
    if (!horaInicio || !horaFin) return 0
    const inicio = parseInt(horaInicio.split(':')[0])
    const fin = parseInt(horaFin.split(':')[0])
    const horas = fin - inicio
    return horas > 0 ? horas * cancha.precio_hora : 0
  }

  const handleReservar = async () => {
    if (!fecha || !horaInicio || !horaFin) {
      setError('Completa todos los campos')
      return
    }
    if (horaFin <= horaInicio) {
      setError('La hora de fin debe ser mayor a la hora de inicio')
      return
    }
    setLoading(true)
    setError('')
    try {
      await axios.post(`${API_URL}/api/reservas`, {
        cancha_id: id,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        total: calcularTotal()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExito(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  const horas = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00']

  const estaOcupada = (hora) => horasOcupadas.includes(hora)

  if (!cancha) return <div style={{color:'#fff',textAlign:'center',padding:'100px'}}>Cargando...</div>

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',fontFamily:'Segoe UI'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <span style={{color:'#fff',fontSize:'20px',fontWeight:'700',cursor:'pointer'}} onClick={() => navigate('/canchas')}>CanchasApp</span>
        <span style={{color:'rgba(255,255,255,0.7)',fontSize:'14px'}}>{user.nombre}</span>
      </div>

      <div style={{maxWidth:'600px',margin:'40px auto',padding:'0 20px'}}>
        <button onClick={() => navigate('/canchas')} style={{background:'none',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.7)',padding:'8px 16px',borderRadius:'8px',cursor:'pointer',marginBottom:'24px'}}>← Volver</button>

        {exito ? (
          <div style={{background:'rgba(0,212,100,0.1)',border:'1px solid rgba(0,212,100,0.3)',borderRadius:'16px',padding:'40px',textAlign:'center'}}>
            <div style={{fontSize:'64px'}}>✅</div>
            <h2 style={{color:'#fff',fontSize:'24px',margin:'16px 0 8px'}}>Reserva Confirmada!</h2>
            <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'24px'}}>Tu reserva en {cancha.nombre} fue registrada exitosamente</p>
            <button onClick={() => navigate('/dashboard')} style={{background:'linear-gradient(135deg,#00d4ff,#0099cc)',border:'none',borderRadius:'12px',color:'#fff',padding:'12px 24px',fontSize:'16px',cursor:'pointer'}}>Ir al Dashboard</button>
          </div>
        ) : (
          <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'32px'}}>
            <h2 style={{color:'#fff',fontSize:'24px',fontWeight:'700',marginBottom:'4px'}}>{cancha.nombre}</h2>
            <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'24px'}}>{cancha.descripcion}</p>
            <div style={{background:'rgba(0,212,255,0.1)',border:'1px solid rgba(0,212,255,0.2)',borderRadius:'8px',padding:'12px 16px',marginBottom:'24px'}}>
              <span style={{color:'#00d4ff',fontWeight:'700'}}>₡{cancha.precio_hora.toLocaleString()} / hora</span>
            </div>

            {error && <div style={{background:'rgba(255,80,80,0.15)',border:'1px solid rgba(255,80,80,0.3)',color:'#ff6b6b',borderRadius:'8px',padding:'10px 16px',marginBottom:'16px'}}>{error}</div>}

            <label style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',display:'block',marginBottom:'8px'}}>Fecha</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{width:'100%',padding:'12px',marginBottom:'16px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'12px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}} />

            <label style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',display:'block',marginBottom:'8px'}}>Hora de inicio</label>
            <select value={horaInicio} onChange={e => setHoraInicio(e.target.value)}
              style={{width:'100%',padding:'12px',marginBottom:'16px',background:'#1a1a2e',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'12px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}}>
              <option value="">Selecciona hora</option>
              {horas.map(h => (
                <option key={h} value={h} disabled={estaOcupada(h)} style={{color: estaOcupada(h) ? '#ff6b6b' : '#fff'}}>
                  {h} {estaOcupada(h) ? '(Ocupado)' : ''}
                </option>
              ))}
            </select>

            <label style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',display:'block',marginBottom:'8px'}}>Hora de fin</label>
            <select value={horaFin} onChange={e => setHoraFin(e.target.value)}
              style={{width:'100%',padding:'12px',marginBottom:'24px',background:'#1a1a2e',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'12px',color:'#fff',fontSize:'15px',boxSizing:'border-box'}}>
              <option value="">Selecciona hora</option>
              {horas.map(h => (
                <option key={h} value={h} disabled={estaOcupada(h)} style={{color: estaOcupada(h) ? '#ff6b6b' : '#fff'}}>
                  {h} {estaOcupada(h) ? '(Ocupado)' : ''}
                </option>
              ))}
            </select>

            {calcularTotal() > 0 && (
              <div style={{background:'rgba(0,212,255,0.05)',border:'1px solid rgba(0,212,255,0.2)',borderRadius:'12px',padding:'16px',marginBottom:'24px',textAlign:'center'}}>
                <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',marginBottom:'4px'}}>Total a pagar</p>
                <p style={{color:'#00d4ff',fontSize:'28px',fontWeight:'700'}}>₡{calcularTotal().toLocaleString()}</p>
              </div>
            )}

            <button onClick={handleReservar} disabled={loading}
              style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#00d4ff,#0099cc)',border:'none',borderRadius:'12px',color:'#fff',fontSize:'16px',fontWeight:'600',cursor:'pointer'}}>
              {loading ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}