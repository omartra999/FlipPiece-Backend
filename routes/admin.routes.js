const express = require('express');

const adminMiddleware = require('../middlewares/admin.middleware.js');
const orderController = require('../controllers/order.controller.js');
const productController = require('../controllers/product.controller.js');
const userController = require('../controllers/user.controller.js');
const checkoutController = require('../controllers/checkout.controller.js');
const shipmentController = require('../controllers/shipment.controller.js');

const { validateOrder } = require('../middlewares/validation.middleware.js');
const { validateProduct } = require('../middlewares/validation.middleware.js');
const { validateDHL } = require('../middlewares/validation.middleware.js');
const { validateRefund } = require('../middlewares/validation.middleware.js');

const adminRouter = express.Router();

adminRouter.get('/orders', adminMiddleware,  orderController.getAllOrders);
adminRouter.get('/orders/:id', adminMiddleware, validateOrder, orderController.getOrderById);
adminRouter.put('/orders/:id/status', adminMiddleware, validateOrder, orderController.setOrderStatus);

adminRouter.get('/products', adminMiddleware, productController.getAllProducts);
adminRouter.get('/products/:id', adminMiddleware,  productController.getProductById);
adminRouter.post('/products', adminMiddleware, validateProduct, productController.createProduct);
adminRouter.put('/products/:id', adminMiddleware, validateProduct, productController.updateProduct);
adminRouter.delete('/products/:id', adminMiddleware,  productController.deleteProduct);

adminRouter.get('/users', adminMiddleware,  userController.getAllUsers);
adminRouter.get('/users/:id', adminMiddleware,  userController.getUserById);

adminRouter.post('/refund', adminMiddleware, validateRefund, checkoutController.createRefund);
adminRouter.post('/shipments', adminMiddleware, validateDHL, shipmentController.createShipment);