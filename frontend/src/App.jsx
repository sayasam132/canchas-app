import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Canchas from './pages/Canchas'
import Reservar from './pages/Reservar'
import MisReservas from './pages/MisReservas'
import Reportes from './pages/Reportes'
import PanelPropietario from './pages/PanelPropietario'

function App() {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const esAdmin = user.rol === 'administrador' || user.rol === 'propietario'
  const esPropietario = user.rol === 'propietario'

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/reservar/:id" element={<Reservar />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/reportes" element={token && esAdmin ? <Reportes /> : <Navigate to="/dashboard" />} />
        <Route path="/panel-propietario" element={token && esPropietario ? <PanelPropietario /> : <Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App