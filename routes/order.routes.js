const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/order.controller.js');
const { validateOrder } = require('../middlewares/validation.middleware.js');

orderRouter.post('/', validateOrder, orderController.createOrder);
orderRouter.get('/:id', validateOrder, orderController.getOrderById);
orderRouter.get('/user/:firebaseUid', validateOrder, orderController.getOrdersByUser);
orderRouter.get('/status/:id', validateOrder, orderController.getOrderStatus)