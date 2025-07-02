const { User, Product, Order, sequelize } = require('../models');
const OrderItemModel = require('../models/orderItem');

let OrderItem;
let user;
let product;
let order;

describe('OrderItem Model', () => {
  beforeAll(async () => {
    // Sync all models
    await sequelize.sync({ force: true });
    // Create a user
    user = await User.create({
      firebaseUid: 'test-uid',
      email: 'test@example.com',
      username: 'testuser1',
      firstName: 'Test',
      lastName: 'User1',
      isAdmin: false
    });
    // Create a product
    product = await Product.create({
      title: 'Test Product',
      description: 'A product for testing',
      price: 10.5,
      category: 'fashion',
      stock: 5,
      options: { sizes: ['M'], colors: ['red'] },
      isShippable: true,
      isPickupOnly: false,
      images: ['img1.jpg'],
      thumbnail: 'img1.jpg'
    });
    // Create an order
    order = await Order.create({
      firebaseUid: user.firebaseUid,
      orderNumber: 'FP-TEST-ORDER',
      shippingAddress: { street: '123 Test St', city: 'Testville' },
      billingAddress: { street: '123 Test St', city: 'Testville' },
      subtotal: 10.5,
      shippingCost: 0,
      tax: 0,
      total: 10.5,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'test',
      notes: '',
      estimatedDelivery: null,
      trackingNumber: null
    });
    OrderItem = OrderItemModel(sequelize, require('sequelize').DataTypes);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should calculate totalPrice on create if not provided', async () => {
    const item = await OrderItem.create({
      orderId: order.id,
      productId: product.id,
      quantity: 2,
      unitPrice: 10.5
    });
    expect(Number(item.totalPrice)).toBeCloseTo(21.0);
  });

  test('should use provided totalPrice if given', async () => {
    const item = await OrderItem.create({
      orderId: order.id,
      productId: product.id,
      quantity: 1,
      unitPrice: 5.0,
      totalPrice: 5.0
    });
    expect(Number(item.totalPrice)).toBeCloseTo(5.0);
  });

  test('should recalculate totalPrice on quantity update', async () => {
    const item = await OrderItem.create({
      orderId: order.id,
      productId: product.id,
      quantity: 1,
      unitPrice: 10.0
    });
    item.quantity = 3;
    await item.save();
    expect(Number(item.totalPrice)).toBeCloseTo(30.0);
  });

  test('should recalculate totalPrice on unitPrice update', async () => {
    const item = await OrderItem.create({
      orderId: order.id,
      productId: product.id,
      quantity: 2,
      unitPrice: 8.0
    });
    item.unitPrice = 12.0;
    await item.save();
    expect(Number(item.totalPrice)).toBeCloseTo(24.0);
  });
}); 