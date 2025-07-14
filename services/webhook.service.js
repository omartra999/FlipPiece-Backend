// services/webhook.service.js
const { Order } = require('../models');

/**
 * Handle Stripe checkout.session.completed event
 * @param {Object} session - The Stripe session object
 */
exports.handleCheckoutSessionCompleted = async (session) => {
    const orderId = session.client_reference_id; 
    const paymentIntentId = session.payment_intent;
    const shipping = session.shipping;
    const customerEmail = session.customer_details?.email;
    const paymentMethod = session.payment_method_types?.[0] || 'card';

    try {
        if (!orderId) throw new Error('No order ID in session');
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');
        await order.update({
            paymentStatus: 'paid',
            paymentMethod: paymentMethod || 'card',
            stripeSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
            shippingAddress: shipping?.address || order.shippingAddress,
            email: customerEmail || order.email
        });
        console.log(`Order ${orderId} marked as paid (checkout.session.completed)`);
    } catch (err) {
        console.error('Error handling checkout.session.completed:', err);
    }
};

/**
 * Handle Stripe payment_intent.succeeded event
 * @param {Object} intent - The Stripe payment intent object
 */
exports.handlePaymentIntentSucceeded = async (intent) => {
    // Example: Update payment status in your DB
    const paymentIntentId = intent.id;
    const paymentMethod = intent.payment_method_types?.[0] || 'card';
    try {
        const order = await Order.findOne({ where: { stripePaymentIntentId: paymentIntentId } });
        if (!order) throw new Error('Order not found for payment intent');
        await order.update({ paymentStatus: 'paid', paymentMethod: paymentMethod });
        console.log(`Order ${order.id} marked as paid (payment_intent.succeeded)`);
    } catch (err) {
        console.error('Error handling payment_intent.succeeded:', err);
    }
};

/**
 * Handle Stripe payment_intent.payment_failed event
 * @param {Object} intent - The Stripe payment intent object
 */
exports.handlePaymentIntentFailed = async (intent) => {
    const paymentIntentId = intent.id;
    const paymentMethod = intent.payment_method_types?.[0] || 'card';
    try {
        const order = await Order.findOne({ where: { stripePaymentIntentId: paymentIntentId } });
        if (!order) throw new Error('Order not found for payment intent');
        await order.update({ paymentStatus: 'failed', paymentMethod: paymentMethod });
        console.log(`Order ${order.id} marked as failed (payment_intent.payment_failed)`);
    } catch (err) {
        console.error('Error handling payment_intent.payment_failed:', err);
    }
};

/**
 * Handle Stripe charge.refunded event
 * @param {Object} charge - The Stripe charge object
 */
exports.handleChargeRefunded = async (charge) => {
    // charge.payment_intent links to your order
    const paymentIntentId = charge.payment_intent;
    try {
        const order = await Order.findOne({ where: { stripePaymentIntentId: paymentIntentId } });
        if (!order) throw new Error('Order not found for refund');
        await order.update({ paymentStatus: 'refunded' });
        console.log(`Order ${order.id} marked as refunded (charge.refunded)`);
    } catch (err) {
        console.error('Error handling charge.refunded:', err);
    }
}; 