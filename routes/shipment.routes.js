const express = require('express');
const shipmentRouter = express.Router();

const shipmentController = require('../controllers/shipment.controller');

// Track a shipment by tracking number
shipmentRouter.get('/track/:trackingNumber', shipmentController.track);


module.exports = shipmentRouter;
