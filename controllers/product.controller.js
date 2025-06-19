const productService = require('../services/product.service');

exports.createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({ message: 'Product created successfully.', product });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: 'Failed to create product.', error: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Failed to fetch products.', error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Failed to fetch product.', error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.json({ message: 'Product updated successfully.', product });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Failed to update product.', error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await productService.deleteProduct(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.json({ message: 'Product deleted successfully.' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Failed to delete product.', error: err.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await productService.getProductsByCategory(req.params.category);
        if (!products.length) {
            return res.status(404).json({ message: 'No products found in this category.' });
        }
        res.json(products);
    } catch (err) {
        console.error('Error fetching products by category:', err);
        res.status(500).json({ message: 'Failed to fetch products by category.', error: err.message });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const products = await productService.searchProducts(req.query.query);
        if (!products.length) {
            return res.status(404).json({ message: 'No products found matching the search query.' });
        }
        res.json(products);
    } catch (err) {
        console.error('Error searching products:', err);
        res.status(500).json({ message: 'Failed to search products.', error: err.message });
    }
};

exports.filterProducts = async (req, res) => {
    try {
        const products = await productService.filterProducts(req.query);
        res.json(products);
    } catch (err) {
        console.error('Error filtering products:', err);
        res.status(500).json({ message: 'Failed to filter products.', error: err.message });
    }
};

