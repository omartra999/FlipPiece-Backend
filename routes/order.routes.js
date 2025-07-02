const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/order.controller.js');
const { validateOrder } = require('../middlewares/validation.middleware.js');

orderRouter.post('/', validateOrder, orderController.createOrder);
orderRouter.post('/checkout', orderController.checkout);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.get('/user/:firebaseUid',  orderController.getOrdersByUser);
orderRouter.get('/status/:id',  orderController.getOrderStatus)

module.exports = orderRouter;