const express = require('express');
const authController = require('@base/controllers/authController');

const router = express.Router();

// Routes
router.post('/login', authController.login);
router.post('/register', authController.register); // Register route

module.exports = router;
