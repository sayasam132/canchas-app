const { supabase } = require('../supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { enviarBienvenida, enviarNotificacionLogin } = require('../services/email.service');

const register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    const { data: existing } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'El email ya esta registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, password: hashedPassword, rol: rol || 'usuario' }])
      .select();

    if (error) throw error;

    enviarBienvenida(nombre, email);

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      'Samysamy132',
      { expiresIn: '24h' }
    );

    enviarNotificacionLogin(user.nombre, user.email);

    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };