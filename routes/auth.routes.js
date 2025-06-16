const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller.js');

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/confirm', authController.confirm);

module.exports = authRouter;