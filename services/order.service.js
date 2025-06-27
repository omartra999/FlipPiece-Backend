const Order = require('../models');

exports.createOrder = async (orderData) => {
  try {
    const order = await Order.Order.create(orderData);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

exports.getOrderById = async (orderId) => {
  try {
    const order = await Order.Order.findByPk(orderId, {
      include: [{
        model: Order.User,
        as: 'user'
      }]
    });
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

exports.getOrdersByUser = async (firebaseUid) => {
  try {
    const orders = await Order.Order.findAll({
      where: { firebaseUid },
      include: [{
        model: Order.User,
        as: 'user'
      }]
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    throw error;
  }
}

exports.getOrderStatus = async (orderId) => {
  try {
    const order = await Order.Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order.status;
  } catch (error) {
    console.error('Error fetching order status:', error);
    throw error;
  }
}


exports.setOrderStatus = async (orderId, status) => {
  try {
    const order = await Order.Order.findByPk(orderId);
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
}