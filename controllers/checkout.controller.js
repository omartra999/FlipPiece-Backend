const checkoutService = require('../services/checkout.service');
const { Product } = require('../models');

exports.createCheckoutSession = async (req, res) => {
    try{
        // Expecting [{productId, quantity}] and a successUrl and cancelUrl
        const { cartItems } = req.body;
        const successUrl = req.body.successUrl || 'http://localhost:3000/checkout/success';
        const cancelUrl = req.body.cancelUrl || 'http://localhost:3000/checkout/cancel';

        if(!cartItems || cartItems.length === 0 || !Array.isArray(cartItems)){
            return res.status(400).json({ error: 'Invalid cart items' });
    }

    //fetch products from DB
    const items = cartItems.map(async item => {
        const product = await Product.findById(item.productId);
        if(!product){
            return res.status(404).json({ error: 'Product not found' });
        }
        return {
            name: product.title,
            price: product.price,
            quantity: item.quantity,
        }
    });
    const session = await checkoutService.createCheckoutSession(items, successUrl, cancelUrl);
    res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
