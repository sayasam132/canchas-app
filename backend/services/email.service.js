const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

const enviarBienvenida = async (nombre, email) => {
  try {
    await resend.emails.send({
      from: 'CanchasApp <onboarding@resend.dev>',
      to: email,
      subject: 'Bienvenido a CanchasApp',
      html: `
        <div style="font-family: Segoe UI, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0f3460, #00d4ff); padding: 40px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px;">⚽ CanchasApp</h1>
            <p style="margin: 8px 0 0; opacity: 0.8;">Sistema de Reservas Deportivas</p>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #00d4ff;">Bienvenido, ${nombre}!</h2>
            <p style="color: rgba(255,255,255,0.7); line-height: 1.6;">
              Nos alegra que te hayas unido a CanchasApp. Ahora podes reservar canchas deportivas de manera facil y rapida.
            </p>
            <div style="background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #00d4ff; margin: 0 0 12px;">Lo que podes hacer:</h3>
              <p style="margin: 8px 0; color: rgba(255,255,255,0.7);">⚽ Reservar canchas de futbol y tenis</p>
              <p style="margin: 8px 0; color: rgba(255,255,255,0.7);">📅 Ver tus reservas y historial</p>
              <p style="margin: 8px 0; color: rgba(255,255,255,0.7);">💳 Pagar con tarjeta de forma segura</p>
            </div>
            <a href="https://canchas-app.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #0099cc); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; margin-top: 16px;">
              Ir a CanchasApp
            </a>
          </div>
          <div style="padding: 20px 40px; background: rgba(255,255,255,0.05); text-align: center;">
            <p style="color: rgba(255,255,255,0.3); font-size: 13px; margin: 0;">CanchasApp - Tu cancha favorita te espera</p>
          </div>
        </div>
      `
    })
    console.log('Email de bienvenida enviado a:', email)
  } catch (error) {
    console.error('Error enviando email:', error)
  }
}

const enviarNotificacionLogin = async (nombre, email) => {
  try {
    await resend.emails.send({
      from: 'CanchasApp <onboarding@resend.dev>',
      to: email,
      subject: 'Nuevo inicio de sesion en CanchasApp',
      html: `
        <div style="font-family: Segoe UI, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0f3460, #00d4ff); padding: 40px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px;">⚽ CanchasApp</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #00d4ff;">Hola, ${nombre}!</h2>
            <p style="color: rgba(255,255,255,0.7); line-height: 1.6;">
              Se ha detectado un nuevo inicio de sesion en tu cuenta de CanchasApp.
            </p>
            <div style="background: rgba(255,200,0,0.1); border: 1px solid rgba(255,200,0,0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0; color: #ffc800;">Si no fuiste tu, cambia tu contrasena inmediatamente.</p>
            </div>
            <a href="https://canchas-app.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #0099cc); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600;">
              Ir a CanchasApp
            </a>
          </div>
          <div style="padding: 20px 40px; background: rgba(255,255,255,0.05); text-align: center;">
            <p style="color: rgba(255,255,255,0.3); font-size: 13px; margin: 0;">CanchasApp - Tu cancha favorita te espera</p>
          </div>
        </div>
      `
    })
    console.log('Email de login enviado a:', email)
  } catch (error) {
    console.error('Error enviando email:', error)
  }
}

module.exports = { enviarBienvenida, enviarNotificacionLogin }