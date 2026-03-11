const { supabase } = require('../supabase');

const getReporteIngresos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reservas')
      .select('*, canchas(nombre, tipo)')
      .eq('estado', 'confirmada')

    if (error) throw error

    const totalIngresos = data.reduce((sum, r) => sum + Number(r.total), 0)
    const totalReservas = data.length

    const porCancha = data.reduce((acc, r) => {
      const nombre = r.canchas?.nombre || 'Desconocida'
      if (!acc[nombre]) acc[nombre] = { reservas: 0, ingresos: 0 }
      acc[nombre].reservas++
      acc[nombre].ingresos += Number(r.total)
      return acc
    }, {})

    res.json({ totalIngresos, totalReservas, porCancha })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getReporteIngresos }