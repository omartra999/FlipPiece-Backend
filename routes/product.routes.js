const express = require('express');
const productRouter = express.Router();
const productController = require('../controllers/product.controller.js');


productRouter.get('/category/:category', productController.getProductsByCategory);
productRouter.get('/search',  productController.searchProducts);
productRouter.get('/filter',  productController.filterProducts);
productRouter.get('/:id',  productController.getProductById);
productRouter.get('/',  productController.getAllProducts);

module.exports = productRouter;
