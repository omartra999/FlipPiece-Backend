const express = require('express');
const productRouter = express.Router();
const productController = require('../controllers/product.controller.js');
const adminMiddleware = require('../middlewares/admin.middleware.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

productRouter.get('/category/:category', productController.getProductsByCategory);
productRouter.get('/search', productController.searchProducts);
productRouter.get('/filter', productController.filterProducts);
productRouter.get('/:id', productController.getProductById);
productRouter.put('/:id', adminMiddleware, productController.updateProduct);
productRouter.delete('/:id', adminMiddleware, productController.deleteProduct);
productRouter.post('/', adminMiddleware, productController.createProduct);
productRouter.get('/', productController.getAllProducts);

module.exports = productRouter;