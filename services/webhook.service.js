// services/webhook.service.js
const { Order } = require('../models');
const dhlService = require('./dhl.service');

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

        // Prevent duplicate processing
        if (order.paymentStatus !== 'pending') {
            console.warn(`Order ${orderId} already processed with status ${order.paymentStatus}`);
            return;
        }

        const paymentStatus = paymentMethod === 'sepa_debit' || paymentMethod === 'bank_transfer' ? 'processing' : 'paid';

        await order.update({
            paymentStatus: paymentStatus,
            paymentMethod: paymentMethod || 'card',
            stripeSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
            shippingAddress: shipping?.address || order.shippingAddress,
            email: customerEmail || order.email,
            status: paymentStatus === 'paid' ? 'confirmed' : 'pending'
        });

        // auto-create DHL shipment for paid orders
        if (paymentStatus === 'paid' && order.shippingService) {
            try {
                const dhlShipment = await dhlService.createShipmentFromOrder(order);

                await order.update({
                    dhlShipmentId: dhlShipment.id,
                    trackingNumber: dhlShipment.trackingNumber,
                    status: 'processing',
                });
            } catch (shipmentError) {
                console.error(`Error creating DHL shipment for order ${orderId}:`, shipmentError);
            }
        }
        console.log(`Order ${orderId} marked as paid (checkout.session.completed)`);
        return order;

    } catch (err) {
        console.error('Error handling checkout.session.completed:', err);
        throw err;
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

        if (paymentMethod === 'sepa_debit' || paymentMethod === 'bank_transfer') {
            // Optionally, you can handle specific logic for these payment methods
            console.log(`Payment method ${paymentMethod} requires customer notification.`);
        }
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

/**
 * Handle SEPA mandate notifications
 * @param {Object} mandate - The Stripe mandate object
 */
exports.handleMandateUpdated = async (mandate) => {
    try {
        if (mandate.payment_method_details?.type === 'sepa_debit') {
            console.log(`SEPA mandate ${mandate.id} updated - Status: ${mandate.status}`);
            // You can store mandate information if needed
        }
    } catch (err) {
        console.error('Error handling mandate.updated:', err);
    }
};

/**
 * Handle payment method attachment (for SEPA mandates)
 * @param {Object} paymentMethod - The Stripe payment method object
 */
exports.handlePaymentMethodAttached = async (paymentMethod) => {
    try {
        if (paymentMethod.type === 'sepa_debit') {
            console.log(`SEPA payment method attached: ${paymentMethod.id}`);
            console.log(`IBAN: ${paymentMethod.sepa_debit?.last4}`);
            // You can store additional SEPA information here
        }
    } catch (err) {
        console.error('Error handling payment_method.attached:', err);
    }
};