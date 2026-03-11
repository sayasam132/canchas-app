const express = require('express')
const router = express.Router()
const { getCanchas, getCancha } = require('../controllers/canchas.controller')

router.get('/', getCanchas)
router.get('/:id', getCancha)

module.exports = router