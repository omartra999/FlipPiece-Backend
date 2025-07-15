const _STRIPE_SECRET_KEY = require('../config/stripe').STRIPE_SECRET_KEY;
const stripe = require('stripe')(_STRIPE_SECRET_KEY);

/**
 * Create a checkout session for an order
 * @param {Object} orderData - Order data including totals
 * @param {String} successUrl - URL to redirect to after successful payment
 * @param {String} cancelUrl - URL to redirect to after payment cancellation
 * @param {Number|String} orderId - The order's ID to link with Stripe session
 * @param {String} email - Customer email
 */
exports.createCheckoutSession = async (orderData, successUrl, cancelUrl, orderId, email) => {
    try {

        // Validate required fields
        if (!orderData || !orderId || !successUrl || !cancelUrl) {
            throw new Error('Missing required parameters for checkout session');
        }

        try {
            new URL(successUrl); // Validate URL format
            new URL(cancelUrl); // Validate URL format
        } catch (error) {
            throw new Error('Invalid URL format for success or cancel URL');
        }
        const {
            items = [],
            subtotal = 0,
            shippingCost = 0,
            tax = 0,
            total = 0,
            currency = 'EUR',
            orderNumber = `Order-${orderId}`,
            customerName = 'Customer'
        } = orderData;

        // Validate order totals
        const calculatedTotal = subtotal + shippingCost + tax;
        if (Math.abs(calculatedTotal - total) > 0.01) {
            throw new Error('Order totals do not match: calculated total does not equal provided total');
        }

        // Create line items for detailed breakdown
        const lineItems = [];

        // Add individual product items
        items.forEach(item => {
            lineItems.push({
                price_data: {
                    currency: currency.toLowerCase(),
                    product_data: {
                        name: item.name || 'Product',
                        description: item.description || `SKU: ${item.sku || 'N/A'}`,
                        images: item.image ? [item.image] : []
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            });
        });

        // Add shipping as a separate line item if > 0
        if (shippingCost > 0) {
            lineItems.push({
                price_data: {
                    currency: currency.toLowerCase(),
                    product_data: {
                        name: 'Shipping',
                        description: 'DHL Shipping Service'
                    },
                    unit_amount: Math.round(shippingCost * 100),
                },
                quantity: 1,
            });
        }

        // Add tax as a separate line item if > 0
        if (tax > 0) {
            lineItems.push({
                price_data: {
                    currency: currency.toLowerCase(),
                    product_data: {
                        name: 'VAT (19%)',
                        description: 'German Value Added Tax'
                    },
                    unit_amount: Math.round(tax * 100),
                },
                quantity: 1,
            });
        }

        // Create checkout session configuration
        const sessionConfig = {
            payment_method_types: ['card', 'sepa_debit', 'giropay', 'sofort', 'paypal'],
            line_items: lineItems,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            client_reference_id: orderId.toString(),
            customer_email: email || undefined,
            metadata: {
                orderId: orderId.toString(),
                orderNumber: orderNumber,
                customerName: customerName,
                isGuest: (!orderData.firebaseUid).toString()
            }
        };

        // Only collect shipping address if we don't already have it
        if (!orderData.shippingAddress) {
            sessionConfig.shipping_address_collection = {
                allowed_countries: ['DE', 'AT', 'CH', 'NL', 'BE', 'FR'], // Extended EU countries
            };
        }

        // Create the checkout session
        const session = await stripe.checkout.sessions.create(sessionConfig);
        
        return session;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};

/**
 * Create a simple checkout session (legacy method for backward compatibility)
 * @param {Array} cartItems - Array of cart items
 * @param {String} successUrl - Success URL
 * @param {String} cancelUrl - Cancel URL
 * @param {Number|String} orderId - Order ID
 * @param {String} email - Customer email
 */
exports.createSimpleCheckoutSession = async (cartItems, successUrl, cancelUrl, orderId, email) => {
    try {
        // Calculate totals
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.19; // German VAT
        const total = subtotal + tax;

        // Create single line item for the total
        const lineItems = [{
            price_data: {
                currency: 'eur',
                product_data: {
                    name: `Order ${orderId}`,
                    description: `${cartItems.length} items + German VAT (19%)`
                },
                unit_amount: Math.round(total * 100),
            },
            quantity: 1,
        }];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'sepa_debit', 'giropay', 'sofort', 'paypal'],
            line_items: lineItems,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            shipping_address_collection: {
                allowed_countries: ['DE'],
            },
            client_reference_id: orderId.toString(),
            customer_email: email || undefined,
        });

        return session;
    } catch (error) {
        console.error('Error creating simple checkout session:', error);
        throw error;
    }
};

/**
 * Create refund for payment intent
 * @param {String} paymentIntentId - Stripe payment intent ID
 * @param {Number} amount - Amount to refund in cents
 * @param {String} reason - Reason for refund
 */
exports.createRefund = async (paymentIntentId, amount, reason = 'requested_by_customer') => {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount,
            reason: reason,
        });
        return refund;
    } catch (error) {
        console.error('Error creating refund:', error);
        throw error;
    }
};

/**
 * Get checkout session details
 * @param {String} sessionId - Stripe session ID
 */
exports.getCheckoutSession = async (sessionId) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'payment_intent']
        });
        return session;
    } catch (error) {
        console.error('Error retrieving checkout session:', error);
        throw error;
    }
};

/**
 * Get payment intent details
 * @param {String} paymentIntentId - Stripe payment intent ID
 */
exports.getPaymentIntent = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        console.error('Error retrieving payment intent:', error);
        throw error;
    }
};

/**
 * Create a payment intent (for custom checkout)
 * @param {Object} params - Payment parameters
 */
exports.createPaymentIntent = async (params) => {
    try {
        const {
            amount,
            currency = 'eur',
            orderId,
            customerEmail,
            paymentMethodTypes = ['card', 'sepa_debit']
        } = params;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
            payment_method_types: paymentMethodTypes,
            metadata: {
                orderId: orderId.toString(),
                customerEmail: customerEmail
            }
        });

        return paymentIntent;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
};

/**
 * Validate webhook signature
 * @param {String} payload - Raw webhook payload
 * @param {String} signature - Stripe signature header
 */
exports.validateWebhookSignature = (payload, signature) => {
    try {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!endpointSecret) {
            throw new Error('Stripe webhook secret not configured');
        }

        const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
        return event;
    } catch (error) {
        console.error('Error validating webhook signature:', error);
        throw error;
    }
};