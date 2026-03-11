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

module.exports = { getCanchas, getCancha }
