const express = require('express')
const router = express.Router()
const { getAdmins, crearAdmin, eliminarAdmin } = require('../controllers/admins.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/', authMiddleware, getAdmins)
router.post('/', authMiddleware, crearAdmin)
router.delete('/:id', authMiddleware, eliminarAdmin)

module.exports = router
