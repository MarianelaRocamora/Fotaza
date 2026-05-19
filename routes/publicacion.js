const express = require('express');
const router = express.Router();
const { mostrarFormulario, crearPublicacion, upload } = require('../controllers/publicacionController');

router.get('/publicacion/nueva', mostrarFormulario);
router.post('/publicacion/nueva', upload.array('imagenes', 10), crearPublicacion);

module.exports = router;