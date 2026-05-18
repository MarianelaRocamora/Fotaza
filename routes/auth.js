const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/registro', authController.mostrarRegistro);
router.post('/registro', authController.registrar);

module.exports = router;