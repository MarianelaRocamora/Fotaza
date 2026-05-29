const express = require('express');
const router = express.Router();
const { verPerfil, seguir, dejarDeSeguir } = require('../controllers/perfilController');
const { soloRegistrados } = require('../middlewares/auth');

router.get('/perfil/:id', verPerfil);                                        
router.post('/perfil/:id/seguir', soloRegistrados, seguir);                  
router.post('/perfil/:id/dejar-de-seguir', soloRegistrados, dejarDeSeguir);  

module.exports = router;