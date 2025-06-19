const { Cart, CartItem, Product } = require('../models');

exports.getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'title', 'price', 'options', 'thumbnail', 'stock']
                }]
            }]
        });
        if (!cart) {
            // Return empty cart object for better UX
            return res.json({ userId, items: [] });
        }
        res.json(cart);
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ message: 'Failed to fetch cart.', error: err.message });
    }
};

exports.addItemToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity, options } = req.body;

    if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ message: 'Product ID and quantity (>=1) are required.' });
    }

    try {
        // Check product exists and stock
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock available.' });
        }

        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId });
        }

        const optionsString = options ? JSON.stringify(options) : null;

        const [cartItem, created] = await CartItem.findOrCreate({
            where: { cartId: cart.id, productId, options: optionsString },
            defaults: { quantity }
        });

        if (!created) {
            // Check if total quantity exceeds stock
            if (product.stock < cartItem.quantity + quantity) {
                return res.status(400).json({ message: 'Not enough stock available.' });
            }
            cartItem.quantity += quantity;
            await cartItem.save();
        }

        res.status(created ? 201 : 200).json(cartItem);
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).json({ message: 'Failed to add item to cart.', error: err.message });
    }
};

exports.updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    try {
        const cartItem = await CartItem.findOne({
            where: { id: itemId, '$cart.userId$': userId },
            include: [
                { model: Cart, as: 'cart' },
                { model: Product, as: 'product', attributes: ['stock'] }
            ]
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }

        // Check stock before updating
        if (cartItem.product && cartItem.product.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock available.' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.json(cartItem);
    } catch (err) {
        console.error('Error updating cart item:', err);
        res.status(500).json({ message: 'Failed to update cart item.', error: err.message });
    }
};

exports.removeItemFromCart = async (req, res) => {
    const userId = req.user.id;
    const itemId = req.params.itemId;

    try {
        const cartItem = await CartItem.findOne({
            where: { id: itemId, '$cart.userId$': userId },
            include: [{ model: Cart, as: 'cart' }]
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }

        await cartItem.destroy();
        res.status(204).send();
    } catch (err) {
        console.error('Error removing cart item:', err);
        res.status(500).json({ message: 'Failed to remove cart item.', error: err.message });
    }
};