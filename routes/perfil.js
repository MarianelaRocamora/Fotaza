const express = require('express');
const router = express.Router();
const { verPerfil, seguir, dejarDeSeguir } = require('../controllers/perfilController');

router.get('/perfil/:id', verPerfil);
router.post('/perfil/:id/seguir', seguir);
router.post('/perfil/:id/dejar-de-seguir', dejarDeSeguir);

module.exports = router;