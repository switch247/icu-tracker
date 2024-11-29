const express = require('express');
const userController = require('@base/controllers/userController');
const authController = require('@base/controllers/authController');

const router = express.Router();

// Routes
router.get('/', userController.getAllUsers); // Protected route
router.get('/:id', userController.getUserById);
router.post('/', authController.verifyToken, userController.createUser);
router.put('/:id',  userController.updateUser);
router.delete('/:id', authController.verifyToken, userController.deleteUser);

module.exports = router;
