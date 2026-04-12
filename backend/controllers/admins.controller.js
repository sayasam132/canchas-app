const { supabase } = require('../supabase')
const bcrypt = require('bcrypt')

const getAdmins = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, created_at')
      .eq('rol', 'administrador')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const crearAdmin = async (req, res) => {
  const { nombre, email, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, password: hashedPassword, rol: 'administrador' }])
      .select()
    if (error) throw error
    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const eliminarAdmin = async (req, res) => {
  const { id } = req.params
  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id)
      .eq('rol', 'administrador')
    if (error) throw error
    res.json({ message: 'Administrador eliminado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getAdmins, crearAdmin, eliminarAdmin }