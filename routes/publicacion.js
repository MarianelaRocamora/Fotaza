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

router.get('/nueva', mostrarFormulario);

router.post(
  '/nueva',
  upload.array('imagenes', 10),
  crearPublicacion
);

router.get('/:id/editar', mostrarEditar);

router.post(
  '/:id/editar',
  upload.array('imagenes', 10),
  editarPublicacion
);


module.exports = router;