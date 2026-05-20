const express = require('express');
const router = express.Router();
const { votar } = require('../controllers/votoController');

router.post('/votar', votar);

module.exports = router;