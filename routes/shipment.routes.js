const express = require('express');
const shipmentRouter = express.Router();

const shipmentController = require('../controllers/shipment.controller');
const { validateDHL } = require('../middlewares/validation.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Track a shipment by tracking number
shipmentRouter.get('/track/:trackingNumber', shipmentController.track);

// Create a new shipment
shipmentRouter.post('/', validateDHL, adminMiddleware, shipmentController.create);

module.exports = shipmentRouter; 