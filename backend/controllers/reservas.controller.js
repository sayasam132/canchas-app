const { supabase } = require('../supabase');

const cancelarReservasVencidas = async () => {
  try {
    const hace24horas = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    await supabase
      .from('reservas')
      .update({ estado: 'cancelada' })
      .eq('estado', 'confirmada')
      .is('tipo_pago', null)
      .lt('created_at', hace24horas)
  } catch (error) {
    console.error('Error cancelando reservas vencidas:', error)
  }
}

const crearReserva = async (req, res) => {
  const { cancha_id, fecha, hora_inicio, hora_fin, total } = req.body
  const usuario_id = req.user.id

  try {
    const { data: conflicto } = await supabase
      .from('reservas')
      .select('*')
      .eq('cancha_id', cancha_id)
      .eq('fecha', fecha)
      .neq('estado', 'cancelada')
      .or(`hora_inicio.lt.${hora_fin},hora_fin.gt.${hora_inicio}`)

    if (conflicto && conflicto.length > 0) {
      return res.status(400).json({ error: 'La cancha ya esta reservada en ese horario' })
    }

    const { data, error } = await supabase
      .from('reservas')
      .insert([{ usuario_id, cancha_id, fecha, hora_inicio, hora_fin, total, estado: 'confirmada' }])
      .select()

    if (error) throw error
    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getMisReservas = async (req, res) => {
  const usuario_id = req.user.id
  try {
    await cancelarReservasVencidas()
    const { data, error } = await supabase
      .from('reservas')
      .select('*, canchas(nombre, tipo)')
      .eq('usuario_id', usuario_id)
      .order('fecha', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const cancelarReserva = async (req, res) => {
  const { id } = req.params
  const usuario_id = req.user.id
  try {
    const { data, error } = await supabase
      .from('reservas')
      .update({ estado: 'cancelada' })
      .eq('id', id)
      .eq('usuario_id', usuario_id)
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getTodasReservas = async (req, res) => {
  try {
    await cancelarReservasVencidas()
    const { data, error } = await supabase
      .from('reservas')
      .select('*, canchas(nombre, tipo), usuarios(nombre, email)')
      .order('fecha', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { crearReserva, getMisReservas, cancelarReserva, getTodasReservas }