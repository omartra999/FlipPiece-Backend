const express = require('express');
const checkoutController = require('../controllers/checkout.controller');


const checkoutRouter = express.Router();

checkoutRouter.post('/checkout', checkoutController.createCheckoutSession);

module.exports = checkoutRouter;