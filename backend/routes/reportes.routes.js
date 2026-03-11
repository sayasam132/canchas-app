const express = require('express')
const router = express.Router()
const { getReporteIngresos } = require('../controllers/reportes.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/ingresos', authMiddleware, getReporteIngresos)

module.exports = router