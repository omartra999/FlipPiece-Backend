const { Cart, CartItem, Product } = require('../models');

exports.getCart = async (userId) => {
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
    return cart || { userId, items: [] };
};

exports.addItemToCart = async (userId, productId, quantity, options) => {
    if (!productId || !quantity || quantity < 1) {
        throw new Error('Product ID and quantity (>=1) are required.');
    }

    const product = await Product.findByPk(productId);
    if (!product) throw new Error('Product not found.');
    if (product.stock < quantity) throw new Error('Not enough stock available.');

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) cart = await Cart.create({ userId });

    const optionsString = options ? JSON.stringify(options) : null;

    const [cartItem, created] = await CartItem.findOrCreate({
        where: { cartId: cart.id, productId, options: optionsString },
        defaults: { quantity }
    });

    if (!created) {
        if (product.stock < cartItem.quantity + quantity) {
            throw new Error('Not enough stock available.');
        }
        cartItem.quantity += quantity;
        await cartItem.save();
    }

    return cartItem;
};

exports.updateCartItem = async (userId, itemId, quantity) => {
    if (!quantity || quantity < 1) {
        throw new Error('Quantity must be at least 1.');
    }

    const cartItem = await CartItem.findOne({
        where: { id: itemId, '$cart.userId$': userId },
        include: [
            { model: Cart, as: 'cart' },
            { model: Product, as: 'product', attributes: ['stock'] }
        ]
    });

    if (!cartItem) throw new Error('Cart item not found.');
    if (cartItem.product && cartItem.product.stock < quantity) {
        throw new Error('Not enough stock available.');
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    return cartItem;
};

exports.removeItemFromCart = async (userId, itemId) => {
    const cartItem = await CartItem.findOne({
        where: { id: itemId, '$cart.userId$': userId },
        include: [{ model: Cart, as: 'cart' }]
    });

    if (!cartItem) throw new Error('Cart item not found.');
    await cartItem.destroy();
    return true;
};
