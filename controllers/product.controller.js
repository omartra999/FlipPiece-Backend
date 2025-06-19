const  { Product }  = require('../models');
const { Op } = require('sequelize');

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, stock, category, options, isShippable, isPickupOnly, images, thumbnail} = req.body;

        // Basic validation
        if (!title || !price || !category) {
            return res.status(400).json({ message: 'Fill out all required fields.' });
        }

        // Create product
        const product = await Product.create({
            title,
            description,
            price,
            category,
            options,
            isShippable,
            isPickupOnly,
            images,
            thumbnail,
            stock
        });

        res.status(201).json({ message: 'Product created successfully.', product });

    }
    catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: 'Failed to create product.', error: err.message });
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'],
            order: [['createdAt', 'DESC']]
        });

        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Failed to fetch products.', error: err.message });
    }
}

exports.getProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findByPk(productId, {
            attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail']
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Failed to fetch product.', error: err.message });
    }
}

exports.updateProduct = async (req, res) => {
    try{
        const productId = req.params.id;
        const { title, description, stock, price, category, options, isShippable, isPickupOnly, images, thumbnail } = req.body;

        // Find product
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Update product
        await product.update({
            title,
            description,
            price,
            category,
            options,
            isShippable,
            isPickupOnly,
            images,
            thumbnail
        });

        res.json({ message: 'Product updated successfully.', product });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Failed to update product.', error: err.message });
    }
}

exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        await product.destroy();
        res.json({ message: 'Product deleted successfully.' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Failed to delete product.', error: err.message });
    }
}

exports.getProductsByCategory = async (req, res) => {
    const category = req.params.category;

    try {
        const products = await Product.findAll({
            where: { category },
            attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'],
            order: [['createdAt', 'DESC']]
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found in this category.' });
        }

        res.json(products);
    } catch (err) {
        console.error('Error fetching products by category:', err);
        res.status(500).json({ message: 'Failed to fetch products by category.', error: err.message });
    }
}

exports.searchProducts = async (req, res) => {
    const { query } = req.query;

    try {
        const products = await Product.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${query}%`
                } || {
                    description: {
                        [Op.iLike]: `%${query}%`
                    }
                } || { category: {
                    [Op.iLike]: `%${query}%`
                } },
            },
            attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'],
            order: [['createdAt', 'DESC']]
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found matching the search query.' });
        }

        res.json(products);
    } catch (err) {
        console.error('Error searching products:', err);
        res.status(500).json({ message: 'Failed to search products.', error: err.message });
    }
}

exports.filterProducts = async (req, res) => {
    const { category, priceRange, isShippable, isPickupOnly } = req.query;

    try {
        const whereClause = {};

        if (category) {
            whereClause.category = category;
        }

        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-').map(Number);
            whereClause.price = { [Op.between]: [minPrice, maxPrice] };
        }

        if (isShippable !== undefined) {
            whereClause.isShippable = isShippable === 'true';
        }

        if (isPickupOnly !== undefined) {
            whereClause.isPickupOnly = isPickupOnly === 'true';
        }

        const products = await Product.findAll({
            where: whereClause,
            attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'],
            order: [['createdAt', 'DESC']]
        });

        res.json(products);
    } catch (err) {
        console.error('Error filtering products:', err);
        res.status(500).json({ message: 'Failed to filter products.', error: err.message });
    }
}

