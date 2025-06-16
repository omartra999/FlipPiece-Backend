const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

userRouter.get('/profile', authMiddleware, userController.profile);

module.exports = userRouter;