import { useNavigate } from 'react-router-dom'

export default function PanelPropietario() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const opciones = [
    { icono: '🏟️', titulo: 'Gestionar Canchas', descripcion: 'Crear, editar, mantenimiento', ruta: '/gestionar-canchas' },
    { icono: '👥', titulo: 'Administradores', descripcion: 'Crear y eliminar admins', ruta: '/gestionar-admins' },
    { icono: '📋', titulo: 'Todas las Reservas', descripcion: 'Ver reservas de usuarios', ruta: '/todas-reservas' },
    { icono: '💰', titulo: 'Facturas', descripcion: 'Ver pagos y estados', ruta: '/facturas' },
    { icono: '📊', titulo: 'Estadisticas', descripcion: 'Ingresos y rendimiento', ruta: '/estadisticas' },
  ]

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',fontFamily:'Segoe UI'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <span style={{color:'#fff',fontSize:'20px',fontWeight:'700',cursor:'pointer'}} onClick={() => navigate('/dashboard')}>CanchasApp</span>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <span style={{color:'rgba(255,255,255,0.7)',fontSize:'14px'}}>{user.nombre}</span>
          <button style={{padding:'8px 16px',background:'rgba(255,80,80,0.2)',border:'1px solid rgba(255,80,80,0.3)',borderRadius:'8px',color:'#ff6b6b',cursor:'pointer',fontSize:'14px'}} onClick={handleLogout}>Cerrar Sesion</button>
        </div>
      </div>

      <div style={{padding:'40px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'}}>
          <span style={{fontSize:'32px'}}>👑</span>
          <h1 style={{color:'#fff',fontSize:'32px',fontWeight:'700'}}>Panel Propietario</h1>
        </div>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'40px'}}>Gestion completa de CanchasApp</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'24px',maxWidth:'1000px'}}>
          {opciones.map((op, i) => (
            <div key={i} onClick={() => navigate(op.ruta)}
              style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'32px',cursor:'pointer',transition:'transform 0.2s'}}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <div style={{fontSize:'40px',marginBottom:'12px'}}>{op.icono}</div>
              <h3 style={{color:'#fff',fontSize:'18px',fontWeight:'700',marginBottom:'8px'}}>{op.titulo}</h3>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px'}}>{op.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}