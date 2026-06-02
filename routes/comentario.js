const express = require('express');
const router = express.Router();
const { comentar } = require('../controllers/comentarioController');

router.post('/', comentar);  // era /comentar

module.exports = router;