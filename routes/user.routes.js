const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller.js');
const  authMiddleware = require('../middlewares/auth.middleware.js');
const { validateUserProfile } = require('../middlewares/validation.middleware.js');

userRouter.get('/profile', authMiddleware, userController.getUserProfile);
userRouter.put('/profile', authMiddleware, validateUserProfile, userController.updateUserProfile);
userRouter.delete('/profile', authMiddleware,  userController.deleteUserAccount);
userRouter.post('/profile', authMiddleware, validateUserProfile, userController.findOrCreateByFirebaseUid);

module.exports = userRouter;
