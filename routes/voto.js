const express = require('express');
const router = express.Router();
const { votar } = require('../controllers/votoController');

router.post('/', votar);  // era /votar, ahora solo /

module.exports = router;