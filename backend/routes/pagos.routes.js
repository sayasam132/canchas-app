const express = require('express')
const router = express.Router()
const { crearSesionPago, pagarEfectivo, subirComprobanteSinpe } = require('../controllers/pagos.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/crear-sesion', authMiddleware, crearSesionPago)
router.post('/efectivo', authMiddleware, pagarEfectivo)
router.post('/sinpe', authMiddleware, subirComprobanteSinpe)

module.exports = router