const express = require('express');
const webhookController = require('../controllers/webhook.controller');
const router = express.Router();

// Stripe requires the raw body for signature verification!
router.post('/stripe', express.raw({type: 'application/json'}), webhookController.handleWebhook);

module.exports = router; 