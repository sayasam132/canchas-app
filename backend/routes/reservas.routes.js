const express = require('express')
const router = express.Router()
const { crearReserva, getMisReservas, cancelarReserva } = require('../controllers/reservas.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/', authMiddleware, crearReserva)
router.get('/mis-reservas', authMiddleware, getMisReservas)
router.put('/cancelar/:id', authMiddleware, cancelarReserva)

module.exports = router