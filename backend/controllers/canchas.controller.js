const { supabase } = require('../supabase');

const getCanchas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('canchas')
      .select('*')
      .eq('disponible', true)

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getCancha = async (req, res) => {
  const { id } = req.params
  try {
    const { data, error } = await supabase
      .from('canchas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getHorasOcupadas = async (req, res) => {
  const { id } = req.params
  const { fecha } = req.query
  try {
    const { data, error } = await supabase
      .from('reservas')
      .select('hora_inicio, hora_fin')
      .eq('cancha_id', id)
      .eq('fecha', fecha)
      .neq('estado', 'cancelada')

    if (error) throw error

    const horasOcupadas = []
    data.forEach(reserva => {
      const inicio = parseInt(reserva.hora_inicio.split(':')[0])
      const fin = parseInt(reserva.hora_fin.split(':')[0])
      for (let h = inicio; h < fin; h++) {
        horasOcupadas.push(`${h.toString().padStart(2,'0')}:00`)
      }
    })

    res.json(horasOcupadas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const crearCancha = async (req, res) => {
  try {
    const { nombre, descripcion, tipo, precio_hora } = req.body
    const { data, error } = await supabase
      .from('canchas')
      .insert([{ nombre, descripcion, tipo, precio_hora }])
      .select()
    if (error) throw error
    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const editarCancha = async (req, res) => {
  const { id } = req.params
  try {
    const { nombre, descripcion, tipo, precio_hora, disponible } = req.body
    const { data, error } = await supabase
      .from('canchas')
      .update({ nombre, descripcion, tipo, precio_hora, disponible })
      .eq('id', id)
      .select()
    if (error) throw error
    res.json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const eliminarCancha = async (req, res) => {
  const { id } = req.params
  try {
    const { error } = await supabase
      .from('canchas')
      .delete()
      .eq('id', id)
    if (error) throw error
    res.json({ message: 'Cancha eliminada' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getCanchas, getCancha, getHorasOcupadas, crearCancha, editarCancha, eliminarCancha }