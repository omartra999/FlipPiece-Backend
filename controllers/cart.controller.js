const cartService = require('../services/cart.service');

exports.getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.uid);
        res.json(cart);
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ message: 'Failed to fetch cart.', error: err.message });
    }
};

exports.addItemToCart = async (req, res) => {
    const { productId, quantity, options } = req.body;
    try {
        const cartItem = await cartService.addItemToCart(req.user.uid, productId, quantity, options);
        res.status(201).json(cartItem);
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(400).json({ message: err.message });
    }
};

exports.updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    try {
        const cartItem = await cartService.updateCartItem(req.user.uid, req.params.itemId, quantity);
        res.json(cartItem);
    } catch (err) {
        console.error('Error updating cart item:', err);
        res.status(400).json({ message: err.message });
    }
};

exports.removeItemFromCart = async (req, res) => {
    try {
        await cartService.removeItemFromCart(req.user.uid, req.params.itemId);
        res.status(204).send();
    } catch (err) {
        console.error('Error removing cart item:', err);
        res.status(400).json({ message: err.message });
    }
};