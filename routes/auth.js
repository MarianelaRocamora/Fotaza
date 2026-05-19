const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/registro', authController.mostrarRegistro);
router.post('/registro', authController.registrar);
router.get('/login', authController.mostrarLogin);
router.post('/login', authController.login);

router.get('/home', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    res.render('home', { 
        usuario: req.session.usuario,
        exito: req.query.exito,
        error: req.query.error
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;