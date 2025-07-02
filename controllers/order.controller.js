const orderService = require('../services/order.service');
const checkoutService = require('../services/checkout.service');
const { Order } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const order = await orderService.createOrder(orderData);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

exports.getOrdersByUser = async (req, res) => {
  try {
    const firebaseUid = req.params.firebaseUid;
    const orders = await orderService.getOrdersByUser(firebaseUid);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

exports.getOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const status = await orderService.getOrderStatus(orderId);
    res.status(200).json({ status });
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({ error: 'Failed to fetch order status' });
  }
}

exports.setOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const updatedOrder = await orderService.setOrderStatus(orderId, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error setting order status:', error);
    res.status(500).json({ error: 'Failed to set order status' });
  }
}

exports.checkout = async (req, res) => {
  try {
    // 1. Create the order (status: pending)
    const orderData = req.body; // includes cart, addresses, user info, etc.
    const order = await orderService.createOrder(orderData);

    // 2. Create Stripe Checkout Session
    const session = await checkoutService.createCheckoutSession(
      req.body.cartItems, // [{name, price, quantity}]
      req.body.successUrl,
      req.body.cancelUrl,
      order.id,
      order.email
    );

    // 3. Save session ID to order
    await order.update({ stripeSessionId: session.id });

    // 4. Return session URL
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error in checkout:', error);
    res.status(500).json({ error: error.message });
  }
};