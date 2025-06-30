const express = require('express');
const productRouter = express.Router();
const productController = require('../controllers/product.controller.js');
const { validateProduct } = require('../middlewares/validation.middleware.js');

productRouter.get('/category/:category', validateProduct, productController.getProductsByCategory);
productRouter.get('/search', validateProduct, productController.searchProducts);
productRouter.get('/filter', validateProduct, productController.filterProducts);
productRouter.get('/:id', validateProduct, productController.getProductById);
productRouter.get('/', validateProduct, productController.getAllProducts);

module.exports = productRouter;