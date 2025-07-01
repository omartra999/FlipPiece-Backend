const axios = require('axios');
const { DHL_API_KEY, DHL_API_BASE_URL } = require('../config/dhlAdmin');

/**
 * Track a DHL shipment by tracking number.
 * @param {string} trackingNumber
 * @returns {Promise<Object>} DHL tracking response
 */
async function trackShipment(trackingNumber) {
  try {
    const response = await axios.get(
      `${DHL_API_BASE_URL}/track/shipments`,
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
    // Return a normalized error object
    throw error.response ? error.response.data : error;
  }
}

module.exports = {
  trackShipment,
}; 