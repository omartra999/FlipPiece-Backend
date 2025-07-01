const { trackShipment, createShipment } = require('../services/dhl.service');

// Track a shipment by tracking number
async function track(req, res) {
    try {
        const { trackingNumber } = req.params;
        const result = await trackShipment(trackingNumber);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message || error });
    }
}

// Create a new shipment
async function create(req, res) {
    try {
        const shipmentData = req.body;
        const result = await createShipment(shipmentData);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message || error });
    }
}

module.exports = {
    track,
    create,
}; 