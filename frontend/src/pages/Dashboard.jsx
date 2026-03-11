import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f3460)',fontFamily:'Segoe UI'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <span style={{color:'#fff',fontSize:'20px',fontWeight:'700'}}>⚽ CanchasApp</span>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <span style={{color:'rgba(255,255,255,0.7)',fontSize:'14px'}}>👤 {user.nombre}</span>
          <button style={{padding:'8px 16px',background:'rgba(255,80,80,0.2)',border:'1px solid rgba(255,80,80,0.3)',borderRadius:'8px',color:'#ff6b6b',cursor:'pointer',fontSize:'14px'}} onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>
      <div style={{padding:'60px 40px',textAlign:'center'}}>
        <h1 style={{color:'#fff',fontSize:'36px',fontWeight:'700',marginBottom:'8px'}}>¡Bienvenido, {user.nombre}! 🎉</h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:'16px',marginBottom:'48px'}}>Rol: <span style={{color:'#00d4ff',fontWeight:'600'}}>{user.rol}</span></p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'24px',maxWidth:'800px',margin:'0 auto'}}>
          <div onClick={() => navigate('/canchas')} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'32px',color:'#fff',fontSize:'32px',cursor:'pointer'}}>⚽<h3>Ver Canchas</h3><p style={{fontSize:'14px',color:'rgba(255,255,255,0.5)'}}>Disponibles</p></div>
          <div onClick={() => navigate('/mis-reservas')} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'32px',color:'#fff',fontSize:'32px',cursor:'pointer'}}>📅<h3>Mis Reservas</h3><p style={{fontSize:'14px',color:'rgba(255,255,255,0.5)'}}>Ver historial</p></div>
          <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'32px',color:'#fff',fontSize:'32px'}}>💳<h3>Pagos</h3><p style={{fontSize:'14px',color:'rgba(255,255,255,0.5)'}}>Próximamente</p></div>
          {(user.rol === 'administrador' || user.rol === 'propietario') && (
            <div onClick={() => navigate('/reportes')} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'32px',color:'#fff',fontSize:'32px',cursor:'pointer'}}>📊<h3>Reportes</h3><p style={{fontSize:'14px',color:'rgba(255,255,255,0.5)'}}>Ver ingresos</p></div>
          )}
        </div>
      </div>
    </div>
  )
}