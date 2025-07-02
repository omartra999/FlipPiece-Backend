const _STRIPE_SECRET_KEY = require('../config/stripe').STRIPE_SECRET_KEY;
const stripe = require('stripe')(_STRIPE_SECRET_KEY);

    /**
     * Create a checkout session for the cart items
     * @param {Array} cartItems - Array of cart items = [{name, price, quantity}]
     * @param {String} successUrl - URL to redirect to after successful payment
     * @param {String} cancelUrl - URL to redirect to after payment cancellation
     */

exports.createCheckoutSession = async (cartItems, successUrl, cancelUrl) => {
    try {
        // Create a line items array
        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
        return session;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
}
