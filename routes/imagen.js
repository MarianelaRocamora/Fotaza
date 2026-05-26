const express = require('express');
const router = express.Router();
const { cerrarComentarios, abrirComentarios } = require('../controllers/imagenController');

router.post('/imagen/:id/cerrar-comentarios', cerrarComentarios);
router.post('/imagen/:id/abrir-comentarios', abrirComentarios);

module.exports = router;