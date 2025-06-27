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

exports.getOrdersByUser = async (firebaseUid, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const orders = await Order.Order.findAndCountAll({
      where: { firebaseUid },
      include: [{
        model: Order.User,
        as: 'user',
        attributes: ['username', 'email', 'firstName', 'lastName'] // Only select needed fields
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
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