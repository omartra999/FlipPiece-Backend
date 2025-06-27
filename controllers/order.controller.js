const orderService = require('../services/order.service');

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