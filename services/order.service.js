const { Order, User } = require('../models');

exports.createOrder = async (orderData) => {
  try {
    // Generate order number if not provided
    if (!orderData.orderNumber) {
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.random().toString(36).substr(2, 4).toUpperCase();
      orderData.orderNumber = `FP-${timestamp}-${random}`;
    }
    
    const order = await Order.create(orderData);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

exports.getOrderById = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId, {
      include: [{
        model: User,
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
    const orders = await Order.findAndCountAll({
      where: { firebaseUid },
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email', 'firstName', 'lastName']
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
    const order = await Order.findByPk(orderId);
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
}