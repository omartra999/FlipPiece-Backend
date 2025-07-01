const dhlService = require('../services/dhl.service');

exports.trackShipment = async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        const result = await dhlService.trackShipment(trackingNumber);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createShipment = async (req, res) => {
    try {
        const shipmentData = req.body;
        const result = await dhlService.createShipment(shipmentData);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

