const _STRIPE_SECRET_KEY = require('../config/stripe').STRIPE_SECRET_KEY;
const _STRIPE_WEBHOOK_SECRET = require('../config/stripe').STRIPE_WEBHOOK_SECRET;
const stripe = require('stripe')(_STRIPE_SECRET_KEY);
const webhookService = require('../services/webhook.service');

exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, _STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.error('Error constructing event:', error);
        return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    // Handle different event types
    switch (event.type) {
        case 'checkout.session.completed':
            await webhookService.handleCheckoutSessionCompleted(event.data.object);
            break;
        case 'payment_intent.succeeded':
            await webhookService.handlePaymentIntentSucceeded(event.data.object);
            break;
        case 'payment_intent.payment_failed':
            await webhookService.handlePaymentIntentFailed(event.data.object);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }

    res.status(200).json({ received: true });
}