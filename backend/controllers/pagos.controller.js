const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const crearSesionPago = async (req, res) => {
  try {
    const { cancha_nombre, total, reserva_id } = req.body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Reserva - ${cancha_nombre}`,
          },
          unit_amount: Math.round(total * 0.002 * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/mis-reservas?pago=exitoso`,
      cancel_url: `${process.env.FRONTEND_URL}/mis-reservas?pago=cancelado`,
      metadata: { reserva_id }
    })

    res.json({ url: session.url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { crearSesionPago }