const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/order.controller.js');

orderRouter.post('/', orderController.createOrder);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.get('/user/:firebaseUid', orderController.getOrdersByUser);
orderRouter.get('/status/:id', orderController.getOrderStatus)