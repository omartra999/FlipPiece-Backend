const {
  Order, User
} = require('../models');
const dhlService = require('./dhl.service');

exports.createOrder = async (orderData) => {
  try {
    // Validate required fields
    if (!orderData.customerEmail || !orderData.items || !orderData.items.length) {
      throw new Error('Customer email and items are required');
    }

    // Calculate financials if not provided
    if (!orderData.subtotal && orderData.items) {
      orderData.subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Calculate German VAT (19%)
    if (!orderData.tax) {
      orderData.tax = orderData.subtotal * 0.19;
    }

    // Calculate shipping cost if address provided
    if (!orderData.shippingCost && orderData.shippingAddress && orderData.items) {
      try {
        orderData.shippingCost = await dhlService.calculateShippingCost({
          destinationAddress: orderData.shippingAddress,
          items: orderData.items,
          service: orderData.shippingService || 'standard'
        });
      } catch (error) {
        console.error('Error calculating shipping cost:', error);
        orderData.shippingCost = 8.50; // Default shipping cost
      }
    }

    // Calculate total if not provided
    if (!orderData.total) {
      orderData.total = parseFloat(orderData.subtotal || 0) +
                       parseFloat(orderData.shippingCost || 0) +
                       parseFloat(orderData.tax || 0);
    }

    // Generate order number if not provided
    if (!orderData.orderNumber) {
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.random().toString(36).substr(2, 4).toUpperCase();
      orderData.orderNumber = `FP-${timestamp}-${random}`;
    }

    // Set guest status
    orderData.isGuest = !orderData.firebaseUid;

    const order = await Order.create(orderData);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

exports.getOrderById = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: User,
          as: 'user',
          required: false // Allow null for guest orders
        }
      ]
    });
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

exports.getOrdersByUser = async (firebaseUid, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const orders = await Order.findAndCountAll({
      where: {
        firebaseUid
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'username',
            'email',
            'firstName',
            'lastName'
          ]
        }
      ],
      limit,
      offset,
      order: [
        [
          'createdAt',
          'DESC'
        ]
      ]
    });

    return {
      orders: orders.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(orders.count / limit),
        totalItems: orders.count,
        itemsPerPage: limit
      }
    };
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    throw error;
  }
};

exports.getOrdersByEmail = async (email, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const orders = await Order.findAndCountAll({
      where: {
        customerEmail: email
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'username',
            'email',
            'firstName',
            'lastName'
          ],
          required: false
        }
      ],
      limit,
      offset,
      order: [
        [
          'createdAt',
          'DESC'
        ]
      ]
    });

    return {
      orders: orders.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(orders.count / limit),
        totalItems: orders.count,
        itemsPerPage: limit
      }
    };
  } catch (error) {
    console.error('Error fetching orders for email:', error);
    throw error;
  }
};

exports.updateOrderStatus = async (orderId, status) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    await order.update({
      status
    });
    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

exports.updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    await order.update({
      paymentStatus
    });
    return order;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

exports.completeOrder = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Only process if order is paid and not already processed
    if (order.paymentStatus === 'paid' && order.status === 'pending') {
      // Update order status to confirmed
      await order.update({
        status: 'confirmed'
      });

      // Create DHL shipment if shipping address is available
      if (order.shippingAddress && !order.dhlShipmentId) {
        try {
          const shipment = await dhlService.createShipmentFromOrder(order);

          await order.update({
            dhlShipmentId: shipment.shipmentId,
            trackingNumber: shipment.trackingNumber,
            estimatedDelivery: shipment.estimatedDelivery,
            status: 'processing'
          });

          console.log(`Shipment created for order ${order.orderNumber}`);
        } catch (shipmentError) {
          console.error('Failed to create shipment:', shipmentError);
          // Don't fail the order completion if shipment creation fails
        }
      }
    }

    return order;
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
};

exports.getOrderStatus = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return {
      orderStatus: order.status,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery
    };
  } catch (error) {
    console.error('Error fetching order status:', error);
    throw error;
  }
};

exports.setOrderStatus = async (orderId, status) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    await order.save();
    return order;
  } catch (error) {
    console.error('Error setting order status:', error);
    throw error;
  }
};

exports.getAllOrders = async (page = 1, limit = 50) => {
  try {
    const offset = (page - 1) * limit;
    const orders = await Order.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'username',
            'email',
            'firstName',
            'lastName'
          ],
          required: false
        }
      ],
      limit,
      offset,
      order: [
        [
          'createdAt',
          'DESC'
        ]
      ]
    });

    return {
      orders: orders.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(orders.count / limit),
        totalItems: orders.count,
        itemsPerPage: limit
      }
    };
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};
