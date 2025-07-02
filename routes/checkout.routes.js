const express = require('express');
const checkoutController = require('../controllers/checkout.controller');
const { validateCheckout } = require('../middlewares/validation.middleware');

const checkoutRouter = express.Router();

checkoutRouter.post('/checkout', validateCheckout, checkoutController.createCheckoutSession);

module.exports = checkoutRouter;