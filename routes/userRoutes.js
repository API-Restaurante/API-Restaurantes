const express = require('express');
const { login } = require('../controllers/userControllerMemoria');
const router = express.Router();

router.post('/teste', login);

module.exports = router;