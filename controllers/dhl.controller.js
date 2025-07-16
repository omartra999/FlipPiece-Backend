const dhlService = require('../services/dhl.service');
const { Order } = require('../models');

/**
 * Track a shipment by tracking number
 * GET /api/dhl/track/:trackingNumber
 */
exports.trackShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    // Validate tracking number exists
    if (!trackingNumber) {
      return res.status(400).json({
        error: 'Tracking number is required',
        code: 'MISSING_TRACKING_NUMBER'
      });
    }

    // Validate tracking number format
    if (typeof trackingNumber !== 'string') {
      return res.status(400).json({
        error: 'Invalid tracking number',
        code: 'INVALID_TRACKING_NUMBER'
      });
    }

    // Call DHL service to track shipment
    const result = await dhlService.trackShipment(trackingNumber);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Shipment tracking retrieved successfully'
    });
  } catch (error) {
    console.error('DHL tracking error:', error);

    const statusCode = error.message === 'Tracking number not found' ? 404 : 500;
    res.status(statusCode).json({
      error: error.message,
      code: 'TRACKING_ERROR'
    });
  }
};

/**
 * Get shipping quote
 * POST /api/dhl/quote
 */
exports.getShippingQuote = async (req, res) => {
  try {
    const {
      destinationAddress, items, service
    } = req.body;

    const cost = await dhlService.calculateShippingCost({
      destinationAddress,
      items,
      service
    });

    res.status(200).json({
      shippingCost: cost,
      service: service || 'standard',
      currency: 'EUR'
    });
  } catch (error) {
    console.error('DHL quote error:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * Get available shipping services
 * POST /api/dhl/services
 */
exports.getAvailableServices = async (req, res) => {
  try {
    const { destinationAddress } = req.body;
    const services = await dhlService.getAvailableServices(destinationAddress);
    res.status(200).json({
      services
    });
  } catch (error) {
    console.error('DHL services error:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * Create shipment from order ID (Admin only)
 * POST /api/dhl/shipments/create/:orderId
 */
exports.createShipmentFromOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    if (order.status !== 'paid') {
      return res.status(400).json({
        error: 'Order must be paid before creating shipment'
      });
    }

    if (order.dhlShipmentId) {
      return res.status(400).json({
        error: 'Shipment already created for this order'
      });
    }

    const shipment = await dhlService.createShipmentFromOrder(order);

    // Update order with shipment details
    await order.update({
      dhlShipmentId: shipment.shipmentId,
      trackingNumber: shipment.trackingNumber,
      estimatedDelivery: shipment.estimatedDelivery,
      status: 'processing'
    });

    res.status(201).json({
      message: 'Shipment created successfully',
      shipment,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        trackingNumber: shipment.trackingNumber,
        status: order.status
      }
    });
  } catch (error) {
    console.error('DHL shipment creation error:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * Create manual shipment (Admin only)
 * POST /api/dhl/shipments/create
 */
exports.createShipment = async (req, res) => {
  try {
    const shipmentData = req.body;
    const result = await dhlService.createShipment(shipmentData);
    res.status(201).json(result);
  } catch (error) {
    console.error('DHL manual shipment error:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * Update order status when shipment is shipped
 * PUT /api/dhl/shipments/:shipmentId/ship
 */
exports.markAsShipped = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const order = await Order.findOne({
      where: {
        dhlShipmentId: shipmentId
      }
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found for shipment'
      });
    }

    await order.update({
      status: 'shipped'
    });

    res.status(200).json({
      message: 'Order marked as shipped',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber
      }
    });
  } catch (error) {
    console.error('Error marking as shipped:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * Get tracking info for an order
 * GET /api/dhl/orders/:orderId/tracking
 */
exports.getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    if (!order.trackingNumber) {
      return res.status(400).json({
        error: 'No tracking number available for this order'
      });
    }

    const tracking = await dhlService.trackShipment(order.trackingNumber);

    res.status(200).json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status
      },
      tracking
    });
  } catch (error) {
    console.error('Error getting order tracking:', error);
    res.status(500).json({
      error: error.message
    });
  }
};
