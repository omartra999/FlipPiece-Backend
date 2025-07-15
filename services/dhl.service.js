const axios = require('axios');
const { DHL_API_KEY, DHL_BASE_URL } = require('../config/dhlAdmin');

/**
 * Track a DHL shipment by tracking number.
 * @param {string} trackingNumber
 * @returns {Promise<Object>} DHL tracking response
 */
exports.trackShipment = async (trackingNumber) => {
    try {

        if (!trackingNumber || typeof trackingNumber !== 'string') {
            throw new Error('Invalid tracking number');
        }

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
        console.error('DHL tracking error:', error.response?.data || error.message);

        if (error.response?.status === 404) {
            throw new Error('Tracking number not found');
        } else if (error.response?.status === 401) {
            throw new Error('Unauthorized access - check your DHL API key');
        } else if (error.code === 'ENOTFOUND') {
            throw new Error('DHL API timeout - DHL API endpoint not reachable - check your network connection');
        }

        throw error.response ? error.response.data : error;
    }
};

/**
 * Get shipping quote from DHL
 * @param {Object} quoteData - Quote request data
 * @returns {Promise<Object>} DHL quote response
 */
exports.getShippingQuote = async (quoteData) => {
    try {
        const {
            originAddress,
            destinationAddress,
            packages,
            service = 'standard'
        } = quoteData;

        const requestData = {
            originAddress: {
                countryCode: originAddress.countryCode || 'DE',
                postalCode: originAddress.postalCode,
                city: originAddress.city
            },
            destinationAddress: {
                countryCode: destinationAddress.countryCode || 'DE',
                postalCode: destinationAddress.postalCode,
                city: destinationAddress.city
            },
            packages: packages.map(pkg => ({
                weight: pkg.weight || 1,
                length: pkg.length || 20,
                width: pkg.width || 15,
                height: pkg.height || 10
            })),
            service: service,
            requestedShipTimestamp: new Date().toISOString()
        };

        const response = await axios.post(
            `${DHL_BASE_URL}/rates/v2`,
            requestData,
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
        console.error('DHL quote error:', error.response?.data || error.message);
        throw error.response ? error.response.data : error;
    }
};

/**
 * Create a DHL shipment from order data
 * @param {Object} order - Order object from database
 * @returns {Promise<Object>} DHL shipment response
 */
exports.createShipmentFromOrder = async (order) => {
    try {
        if (!order.shippingAddress) {
            throw new Error('Shipping address is required for DHL shipment');
        }

        const shipmentData = {
            shipmentDetails: {
                service: order.shippingService || 'standard',
                packageDetails: calculatePackageDetails(order.items),
                shipmentTimestamp: new Date().toISOString(),
                reference: order.orderNumber
            },
            pickup: {
                address: {
                    name: process.env.COMPANY_NAME || 'FlipPiece',
                    addressLine1: process.env.COMPANY_ADDRESS || 'Company Street 1',
                    city: process.env.COMPANY_CITY || 'Munich',
                    postalCode: process.env.COMPANY_POSTAL_CODE || '80331',
                    countryCode: 'DE'
                },
                contactInformation: {
                    email: process.env.COMPANY_EMAIL || 'info@flippiece.com',
                    phone: process.env.COMPANY_PHONE || '+49123456789'
                }
            },
            delivery: {
                address: {
                    name: order.customerName || 'Customer',
                    addressLine1: order.shippingAddress.line1,
                    addressLine2: order.shippingAddress.line2 || '',
                    city: order.shippingAddress.city,
                    postalCode: order.shippingAddress.postal_code,
                    countryCode: order.shippingAddress.country || 'DE'
                },
                contactInformation: {
                    email: order.customerEmail,
                    phone: order.customerPhone || ''
                }
            }
        };

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

        return {
            shipmentId: response.data.shipmentId,
            trackingNumber: response.data.trackingNumber,
            estimatedDelivery: response.data.estimatedDelivery,
            shippingLabel: response.data.shippingLabel
        };
    } catch (error) {
        console.error('DHL shipment creation error:', error.response?.data || error.message);
        throw error.response ? error.response.data : error;
    }
};

/**
 * Create a DHL shipment (legacy method - kept for backward compatibility)
 * @param {Object} shipmentData
 * @returns {Promise<Object>} DHL shipment response
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
        console.error('DHL shipment error:', error.response?.data || error.message);
        throw error.response ? error.response.data : error; 
    }
};

/**
 * Calculate shipping cost for given parameters
 * @param {Object} params - Shipping parameters
 * @returns {Promise<number>} Shipping cost in EUR
 */
exports.calculateShippingCost = async (params) => {
    try {
        const {
            destinationAddress,
            items,
            service = 'standard'
        } = params;

        const packages = calculatePackageDetails(items);
        const originAddress = {
            countryCode: 'DE',
            postalCode: process.env.COMPANY_POSTAL_CODE || '80331',
            city: process.env.COMPANY_CITY || 'Munich'
        };

        const quote = await this.getShippingQuote({
            originAddress,
            destinationAddress,
            packages,
            service
        });

        // Extract cost from quote response
        const baseCost = quote.products?.[0]?.totalPrice || 8.50;
        
        // Add service-specific pricing
        const serviceMultiplier = {
            'standard': 1.0,
            'express': 1.5,
            'overnight': 2.0
        };

        return baseCost * (serviceMultiplier[service] || 1.0);
    } catch (error) {
        console.error('Error calculating shipping cost:', error);
        // Return default shipping cost if API fails
        return service === 'express' ? 12.50 : service === 'overnight' ? 19.99 : 8.50;
    }
};

/**
 * Get available shipping services for destination
 * @param {Object} destinationAddress
 * @returns {Promise<Array>} Available services
 */
exports.getAvailableServices = async (destinationAddress) => {
    try {
        const quote = await this.getShippingQuote({
            originAddress: {
                countryCode: 'DE',
                postalCode: process.env.COMPANY_POSTAL_CODE || '80331',
                city: process.env.COMPANY_CITY || 'Munich'
            },
            destinationAddress,
            packages: [{ weight: 1, length: 20, width: 15, height: 10 }]
        });

        return quote.products?.map(product => ({
            service: product.productCode,
            name: product.productName,
            price: product.totalPrice,
            deliveryTime: product.deliveryTime
        })) || [];
    } catch (error) {
        console.error('Error getting services:', error);
        return [
            { service: 'standard', name: 'Standard Shipping', price: 8.50, deliveryTime: '2-3 days' },
            { service: 'express', name: 'Express Shipping', price: 12.50, deliveryTime: '1-2 days' }
        ];
    }
};

/**
 * Helper function to calculate package details from order items
 * @param {Array} items - Order items
 * @returns {Array} Package details
 */
function calculatePackageDetails(items) {
    if (!items || items.length === 0) {
        return [{
            weight: 1,
            length: 20,
            width: 15,
            height: 10
        }];
    }

    // Calculate total weight and dimensions
    const totalWeight = items.reduce((sum, item) => {
        const itemWeight = item.weight || 0.5; // Default 0.5kg per item
        return sum + (itemWeight * item.quantity);
    }, 0);

    // Simple packaging logic - you can make this more sophisticated
    const packageCount = Math.ceil(totalWeight / 10); // Max 10kg per package
    const packages = [];

    for (let i = 0; i < packageCount; i++) {
        packages.push({
            weight: Math.min(totalWeight - (i * 10), 10),
            length: 30,
            width: 20,
            height: 15
        });
    }

    return packages;
}

/**
 * Validate German postal code
 * @param {string} postalCode
 * @returns {boolean}
 */
exports.validateGermanPostalCode = (postalCode) => {
    const germanPostalRegex = /^[0-9]{5}$/;
    return germanPostalRegex.test(postalCode);
};

/**
 * Format address for DHL API
 * @param {Object} address
 * @returns {Object} Formatted address
 */
exports.formatAddressForDHL = (address) => {
    return {
        name: address.name || 'Customer',
        addressLine1: address.line1 || address.street,
        addressLine2: address.line2 || '',
        city: address.city,
        postalCode: address.postal_code || address.postalCode,
        countryCode: address.country || 'DE'
    };
};