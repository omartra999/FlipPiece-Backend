const express = require('express');
const shipmentRouter = express.Router();

const shipmentController = require('../controllers/shipment.controller');
const { validateDhlShipment } = require('../middlewares/validation.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Track a shipment by tracking number
shipmentRouter.get('/track/:trackingNumber', shipmentController.track);

// Create a new shipment
shipmentRouter.post('/', validateDhlShipment, adminMiddleware, shipmentController.create);

module.exports = shipmentRouter; 