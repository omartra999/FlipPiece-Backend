const express = require('express');
const cartController = require('../controllers/cart.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

const cartRouter = express.Router();

cartRouter.get('/', authMiddleware, cartController.getCart);
cartRouter.post('/items', authMiddleware, cartController.addItemToCart);
cartRouter.put('/items/:itemId', authMiddleware, cartController.updateCartItem);
cartRouter.delete('/items/:itemId', authMiddleware, cartController.removeItemFromCart);

module.exports = cartRouter;
