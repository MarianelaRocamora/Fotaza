const express = require('express');
const router = express.Router();

const {
  mostrarFormulario,
  crearPublicacion,
  upload,
  manejarErrorMulter
} = require('../controllers/publicacionController');

const {
  mostrarEditar,
  editarPublicacion
} = require('../controllers/edicionController');

router.get('/publicacion/nueva', mostrarFormulario);

router.post(
  '/publicacion/nueva',
  upload.array('imagenes', 10),
  crearPublicacion
);

router.get('/publicacion/:id/editar', mostrarEditar);

router.post(
  '/publicacion/:id/editar',
  upload.array('imagenes', 10),
  editarPublicacion
);

module.exports = router;