const express = require('express')
const router = express.Router()
const { crearSesionPago } = require('../controllers/pagos.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/crear-sesion', authMiddleware, crearSesionPago)

module.exports = router