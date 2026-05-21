const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/registro', authController.mostrarRegistro);
router.post('/registro', authController.registrar);
router.get('/login', authController.mostrarLogin);
router.post('/login', authController.login);
router.get('/home', authController.home);
router.get('/logout', authController.logout);

module.exports = router;