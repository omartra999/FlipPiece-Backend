const axios = require('axios');
const { DHL_API_KEY, DHL_BASE_URL } = require('../config/dhlAdmin');

/**
 * Track a DHL shipment by tracking number.
 * @param {string} trackingNumber
 * @returns {Promise<Object>} DHL tracking response
 */

exports.trackShipment = async (trackingNumber) => {
    try {
        const response = await axios.get(
            `${DHL_BASE_URL}/track/shipments/v2`,
            {
                params: { trackingNumber },
                headers: {
                    'DHL-API-Key': DHL_API_KEY,
                    'Accept': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

/**
 * Create a DHL shipment.
 * @param {json} shipmentData
 * @returns {Promise<Object>} DHL tracking response
 */

exports.createShipment = async (shipmentData) => {
    try {
        const response = await axios.post(
            `${DHL_BASE_URL}/shipments/v2`,
            shipmentData,
            {
                headers: {
                    'DHL-API-Key': DHL_API_KEY,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error; 
    }
}

