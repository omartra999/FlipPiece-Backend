const orderService = require('../services/order.service');
const checkoutService = require('../services/checkout.service');
const dhlService = require('../services/dhl.service');
const {
  Order, User
} = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const order = await orderService.createOrder(orderData);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      error: 'Failed to fetch order'
    });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const firebaseUid = req.params.firebaseUid;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await orderService.getOrdersByUser(firebaseUid, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    res.status(500).json({
      error: 'Failed to fetch orders'
    });
  }
};

exports.getOrdersByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await orderService.getOrdersByEmail(email, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching orders for email:', error);
    res.status(500).json({
      error: 'Failed to fetch orders'
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const result = await orderService.getAllOrders(page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      error: 'Failed to fetch orders'
    });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const status = await orderService.getOrderStatus(orderId);
    res.status(200).json(status);
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({
      error: 'Failed to fetch order status'
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.completeOrder(orderId);
    res.status(200).json({
      message: 'Order completed successfully',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber
      }
    });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.checkout = async (req, res) => {
  try {
    const {
      firebaseUid,
      customerEmail,
      customerName,
      customerPhone,
      items,
      shippingAddress,
      shippingService,
      successUrl,
      cancelUrl,
      currency = 'EUR'
    } = req.body;

    // Validate required fields
    if (!customerEmail || !items || !items.length) {
      return res.status(400).json({
        error: 'Customer email and items are required'
      });
    }

    // Create or find user if firebaseUid provided
    if (firebaseUid) {
      const { User } = require('../models');
      await User.findOrCreate({
        where: {
          firebaseUid
        },
        defaults: {
          firebaseUid,
          email: customerEmail,
          username: customerEmail.split('@')[0]
        }
      });
    }

    // Calculate shipping cost if address provided
    let shippingCost = 0;
    if (shippingAddress) {
      try {
        shippingCost = await dhlService.calculateShippingCost({
          destinationAddress: shippingAddress,
          items,
          service: shippingService || 'standard'
        });
      } catch (error) {
        console.error('Error calculating shipping cost:', error);
        shippingCost = 8.50; // Default shipping cost
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.19; // German VAT 19%
    const total = subtotal + shippingCost + tax;

    // Create order
    const orderData = {
      firebaseUid: firebaseUid || null,
      customerEmail,
      customerName,
      customerPhone,
      items,
      shippingAddress: shippingAddress || null,
      shippingService: shippingService || 'standard',
      subtotal,
      shippingCost,
      tax,
      total,
      currency,
      status: 'pending',
      paymentStatus: 'pending',
      isGuest: !firebaseUid
    };

    const order = await orderService.createOrder(orderData);

    // Create Stripe session with calculated total
    const session = await checkoutService.createCheckoutSession(
      {
        items: order.items,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        tax: order.tax,
        total: order.total,
        currency: order.currency,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        shippingAddress: order.shippingAddress, // If already collected
        firebaseUid: order.firebaseUid
      },
      req.body.successUrl,
      req.body.cancelUrl,
      order.id,
      order.customerEmail
    );

    // Save session ID to order
    await order.update({
      stripeSessionId: session.id
    });

    res.status(201).json({
      message: 'Order created and checkout session initialized',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        currency: order.currency,
        isGuest: order.isGuest
      },
      checkoutUrl: session.url
    });
  } catch (error) {
    console.error('Error in checkout:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.setOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const updatedOrder = await orderService.setOrderStatus(orderId, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error setting order status:', error);
    res.status(500).json({
      error: 'Failed to set order status'
    });
  }
};
