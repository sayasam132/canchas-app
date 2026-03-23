const express = require('express')
const router = express.Router()
const { getCanchas, getCancha, getHorasOcupadas } = require('../controllers/canchas.controller')

router.get('/', getCanchas)
router.get('/:id', getCancha)
router.get('/:id/horas-ocupadas', getHorasOcupadas)

module.exports = router