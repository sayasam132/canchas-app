const express = require('express')
const router = express.Router()
const { getCanchas, getCancha, getHorasOcupadas, crearCancha, editarCancha, eliminarCancha } = require('../controllers/canchas.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/', getCanchas)
router.get('/:id', getCancha)
router.get('/:id/horas-ocupadas', getHorasOcupadas)
router.post('/', authMiddleware, crearCancha)
router.put('/:id', authMiddleware, editarCancha)
router.delete('/:id', authMiddleware, eliminarCancha)

module.exports = router