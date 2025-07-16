const {
  Order, User, Product
} = require('../models');
const orderService = require('../services/order.service');

describe('Order Service', () => {
  let testUser, testProduct, testOrder;

  beforeEach(async () => {
    // Clean up data only, not schema
    await Order.destroy({
      where: {}
    });
    await User.destroy({
      where: {}
    });
    await Product.destroy({
      where: {}
    });

    // Create test user
    testUser = await User.create({
      firebaseUid: 'test-user-uid',
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      isAdmin: false
    });

    // Create test product
    testProduct = await Product.create({
      title: 'Test Product',
      description: 'A test product',
      price: 29.99,
      category: 'fashion',
      stock: 10,
      options: {
        sizes: [
          'M',
          'L'
        ],
        colors: [
          'red',
          'blue'
        ]
      },
      isShippable: true,
      isPickupOnly: false,
      images: ['test1.jpg'],
      thumbnail: 'test1.jpg'
    });
  });

  afterAll(async () => {
    await Order.sequelize.close();
  });

  describe('createOrder', () => {
    test('creates an order with valid data', async () => {
      const orderData = {
        firebaseUid: testUser.firebaseUid,
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          postalCode: '12345',
          country: 'Germany'
        },
        billingAddress: {
          street: '123 Test St',
          city: 'Test City',
          postalCode: '12345',
          country: 'Germany'
        },
        total: 29.99,
        status: 'pending'
      };

      const order = await orderService.createOrder(orderData);

      expect(order).toBeTruthy();
      expect(order.firebaseUid).toBe(testUser.firebaseUid);
      expect(order.total).toBe('29.99');
      expect(order.status).toBe('pending');
      expect(order.orderNumber).toBeTruthy(); // Should be auto-generated
      expect(order.shippingAddress).toEqual(orderData.shippingAddress);
    });

    test('throws error for invalid order data', async () => {
      const invalidOrderData = {
        firebaseUid: 'non-existent-uid',
        total: -10 // Invalid negative price
      };

      await expect(orderService.createOrder(invalidOrderData))
        .rejects.toThrow();
    });
  });

  describe('getOrderById', () => {
    beforeEach(async () => {
      testOrder = await orderService.createOrder({
        firebaseUid: testUser.firebaseUid,
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          postalCode: '12345',
          country: 'Germany'
        },
        billingAddress: {
          street: '123 Test St',
          city: 'Test City',
          postalCode: '12345',
          country: 'Germany'
        },
        total: 29.99,
        status: 'pending'
      });
    });

    test('returns order with user data when found', async () => {
      const order = await orderService.getOrderById(testOrder.id);

      expect(order).toBeTruthy();
      expect(order.id).toBe(testOrder.id);
      expect(order.user).toBeTruthy();
      expect(order.user.firebaseUid).toBe(testUser.firebaseUid);
      expect(order.user.username).toBe('testuser');
    });

    test('returns null for non-existent order', async () => {
      const order = await orderService.getOrderById(99999);
      expect(order).toBeNull();
    });
  });

  describe('getOrdersByUser', () => {
    beforeEach(async () => {
      // Create multiple orders for the test user
      await orderService.createOrder({
        firebaseUid: testUser.firebaseUid,
        shippingAddress: {
          street: '123 St',
          city: 'City',
          postalCode: '12345',
          country: 'Germany'
        },
        billingAddress: {
          street: '123 St',
          city: 'City',
          postalCode: '12345',
          country: 'Germany'
        },
        total: 29.99,
        status: 'pending'
      });

      await orderService.createOrder({
        firebaseUid: testUser.firebaseUid,
        shippingAddress: {
          street: '456 St',
          city: 'City',
          postalCode: '12345',
          country: 'Germany'
        },
        billingAddress: {
          street: '456 St',
          city: 'City',
          postalCode: '12345',
          country: 'Germany'
        },
        total: 59.98,
        status: 'confirmed'
      });
    });

    test('returns paginated orders for user', async () => {
      const result = await orderService.getOrdersByUser(testUser.firebaseUid, 1, 5);

      expect(result).toHaveProperty('orders');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.orders)).toBe(true);
      expect(result.orders.length).toBeGreaterThan(0);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalItems).toBeGreaterThan(0);
    });

    test('returns empty array for user with no orders', async () => {
      const result = await orderService.getOrdersByUser('non-existent-uid');
      expect(result.orders).toEqual([]);
      expect(result.pagination.totalItems).toBe(0);
    });

    test('respects pagination limits', async () => {
      const result = await orderService.getOrdersByUser(testUser.firebaseUid, 1, 1);
      expect(result.orders.length).toBeLessThanOrEqual(1);
      expect(result.pagination.itemsPerPage).toBe(1);
    });
  });

  describe('getOrderStatus', () => {
    beforeEach(async () => {
      testOrder = await orderService.createOrder({
        firebaseUid: testUser.firebaseUid,
        shippingAddress: {
          street: '123 St',
          city: 'City',
          postalCode: '12345',
          country: 'Germany'
        },
        billingAddress: {
          street: '123 St',
          city: 'City',
          postalCode: '12345',
          country: 'Germany'
        },
        total: 29.99,
        status: 'pending'
      });
    });

    test('returns order status when order exists', async () => {
      const status = await orderService.getOrderStatus(testOrder.id);
      expect(status).toBe('pending');
    });

    test('throws error for non-existent order', async () => {
      await expect(orderService.getOrderStatus(99999))
        .rejects.toThrow('Order not found');
    });
  });

  describe('setOrderStatus', () => {
    beforeEach(async () => {
      testOrder = await orderService.createOrder({
        firebaseUid: testUser.firebaseUid,
        shippingAddress: {
          street: '123 St',
          city: 'City',
          postalCode: '12345',
          country: 'Germany'
        },
        billingAddress: {
          street: '123 St',
          city: 'City',
          postalCode: '12345',
          country: 'Germany'
        },
        total: 29.99,
        status: 'pending'
      });
    });

    test('updates order status successfully', async () => {
      const updatedOrder = await orderService.setOrderStatus(testOrder.id, 'confirmed');

      expect(updatedOrder.status).toBe('confirmed');
      expect(updatedOrder.id).toBe(testOrder.id);
    });

    test('throws error for non-existent order', async () => {
      await expect(orderService.setOrderStatus(99999, 'confirmed'))
        .rejects.toThrow('Order not found');
    });

    test('validates status transitions', async () => {
      // Test valid status transitions
      const validStatuses = [
        'pending',
        'confirmed',
        'shipped',
        'delivered',
        'cancelled'
      ];

      for (const status of validStatuses) {
        const updatedOrder = await orderService.setOrderStatus(testOrder.id, status);
        expect(updatedOrder.status).toBe(status);
      }
    });
  });
});
