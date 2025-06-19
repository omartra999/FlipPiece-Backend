const { Product } = require('../models');
const { Op } = require('sequelize');

exports.createProduct = async (data) => {
    const parsedOptions = typeof data.options === 'string' ? JSON.parse(data.options) : data.options;
    return Product.create({
        ...data,
        options: parsedOptions
    });
};

exports.getAllProducts = async () => {
    return Product.findAll({
        attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'],
        order: [['createdAt', 'DESC']]
    });
};

exports.getProductById = async (id) => {
    return Product.findByPk(id, {
        attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail']
    });
};

exports.updateProduct = async (id, data) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    const parsedOptions = typeof data.options === 'string' ? JSON.parse(data.options) : data.options;
    await product.update({
        ...data,
        options: parsedOptions
    });
    return product;
};

exports.deleteProduct = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return true;
};

exports.getProductsByCategory = async (category) => {
    return Product.findAll({
        where: { category },
        attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'],
        order: [['createdAt', 'DESC']]
    });
};

exports.searchProducts = async (query) => {
    return Product.findAll({
        where: {
            [Op.or]: [
                { title: { [Op.iLike]: `%${query}%` } },
                { description: { [Op.iLike]: `%${query}%` } },
                { category: { [Op.iLike]: `%${query}%` } }
            ]
        },
        attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'],
        order: [['createdAt', 'DESC']]
    });
};

exports.filterProducts = async (filters) => {
    const { category, priceRange, isShippable, isPickupOnly } = filters;
    const whereClause = {};

    if (category) whereClause.category = category;
    if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
        whereClause.price = { [Op.between]: [minPrice, maxPrice] };
    }
    if (isShippable !== undefined) whereClause.isShippable = isShippable === 'true';
    if (isPickupOnly !== undefined) whereClause.isPickupOnly = isPickupOnly === 'true';

    return Product.findAll({
        where: whereClause,
        attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'],
        order: [['createdAt', 'DESC']]
    });
};