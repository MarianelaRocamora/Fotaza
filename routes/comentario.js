const express = require('express');
const router = express.Router();
const { comentar } = require('../controllers/comentarioController');

router.post('/comentar', comentar);

module.exports = router;