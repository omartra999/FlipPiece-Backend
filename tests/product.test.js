const { Product } = require('../models');
const productService = require('../services/product.service');

describe('Product Service', () => {
  beforeEach(async () => {
    await Product.sync({
      force: true
    });
  });

  afterAll(async () => {
    await Product.sequelize.close();
  });

  test('createProduct creates a product with valid data', async () => {
    const data = {
      title: 'Test Product',
      description: 'A product for testing',
      price: 10.99,
      category: 'fashion',
      stock: 5,
      options: {
        sizes: ['M'],
        colors: ['red']
      },
      isShippable: true,
      isPickupOnly: false,
      images: ['img1.jpg'],
      thumbnail: 'img1.jpg'
    };
    const product = await productService.createProduct(data);
    expect(product.title).toBe('Test Product');
    expect(Number(product.price)).toBeCloseTo(10.99);
    expect(product.category).toBe('fashion');
    expect(product.options.sizes).toContain('M');
  });

  test('getAllProducts returns all products', async () => {
    await productService.createProduct({
      title: 'Test Product',
      description: 'A product for testing',
      price: 10.99,
      category: 'fashion',
      stock: 5,
      options: {
        sizes: ['M'],
        colors: ['red']
      },
      isShippable: true,
      isPickupOnly: false,
      images: ['img1.jpg'],
      thumbnail: 'img1.jpg'
    });
    const products = await productService.getAllProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('getProductById returns the correct product', async () => {
    const created = await productService.createProduct({
      title: 'Test Product',
      description: 'A product for testing',
      price: 10.99,
      category: 'fashion',
      stock: 5,
      options: {
        sizes: ['M'],
        colors: ['red']
      },
      isShippable: true,
      isPickupOnly: false,
      images: ['img1.jpg'],
      thumbnail: 'img1.jpg'
    });
    const product = await productService.getProductById(created.id);
    expect(product).toBeTruthy();
    expect(product.title).toBe('Test Product');
  });

  test('updateProduct updates product fields', async () => {
    const created = await productService.createProduct({
      title: 'Test Product',
      description: 'A product for testing',
      price: 10.99,
      category: 'fashion',
      stock: 5,
      options: {
        sizes: ['M'],
        colors: ['red']
      },
      isShippable: true,
      isPickupOnly: false,
      images: ['img1.jpg'],
      thumbnail: 'img1.jpg'
    });
    const updated = await productService.updateProduct(created.id, {
      price: 15.99,
      stock: 10
    });
    expect(Number(updated.price)).toBeCloseTo(15.99);
    expect(updated.stock).toBe(10);
  });

  test('deleteProduct removes a product', async () => {
    const created = await productService.createProduct({
      title: 'Test Product',
      description: 'A product for testing',
      price: 10.99,
      category: 'fashion',
      stock: 5,
      options: {
        sizes: ['M'],
        colors: ['red']
      },
      isShippable: true,
      isPickupOnly: false,
      images: ['img1.jpg'],
      thumbnail: 'img1.jpg'
    });
    const deleted = await productService.deleteProduct(created.id);
    expect(deleted).toBe(true);
    const afterDelete = await productService.getProductById(created.id);
    expect(afterDelete).toBeNull();
  });

  test('getProductById returns null for non-existent product', async () => {
    const product = await productService.getProductById(99999);
    expect(product).toBeNull();
  });

  test('updateProduct returns null for non-existent product', async () => {
    const updated = await productService.updateProduct(99999, {
      price: 20
    });
    expect(updated).toBeNull();
  });

  test('deleteProduct returns null for non-existent product', async () => {
    const deleted = await productService.deleteProduct(99999);
    expect(deleted).toBeNull();
  });

  test('getProductsByCategory returns products of that category', async () => {
    await productService.createProduct({
      title: 'Lamp',
      description: 'A lamp',
      price: 20,
      category: 'design',
      stock: 3,
      options: {},
      isShippable: true,
      isPickupOnly: false,
      images: [],
      thumbnail: ''
    });
    const products = await productService.getProductsByCategory('design');
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].category).toBe('design');
  });

  test('searchProducts finds products by title, description, or category', async () => {
    try {
      await productService.createProduct({
        title: 'Lamp',
        description: 'A lamp for testing search',
        price: 20,
        category: 'design',
        stock: 3,
        options: {},
        isShippable: true,
        isPickupOnly: false,
        images: [],
        thumbnail: ''
      });

      const byTitle = await productService.searchProducts('Lamp');
      expect(byTitle.length).toBeGreaterThan(0);
      console.log('byTitle: ', byTitle);

      const byDesc = await productService.searchProducts('lamp');
      expect(byDesc.length).toBeGreaterThan(0);

      const byCategory = await productService.searchProducts('design');
      expect(byCategory.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('Error in searchProducts test:', error);
      throw error; // Re-throw to fail the test
    }
  });

  test('filterProducts filters by category and price range', async () => {
    await productService.createProduct({
      title: 'Lamp',
      description: 'A lamp for filtering',
      price: 20,
      category: 'design',
      stock: 3,
      options: {},
      isShippable: true,
      isPickupOnly: false,
      images: [],
      thumbnail: ''
    });

    const filtered = await productService.filterProducts({
      category: 'design',
      priceRange: '10-30'
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered[0].category).toBe('design');
    expect(Number(filtered[0].price)).toBeGreaterThanOrEqual(10);
    expect(Number(filtered[0].price)).toBeLessThanOrEqual(30);
  });

  test('createProduct throws if options is invalid JSON', async () => {
    await expect(productService.createProduct({
      title: 'Broken',
      description: 'Bad options',
      price: 5,
      category: 'fashion',
      stock: 1,
      options: '{not: \'json\'}',
      isShippable: true,
      isPickupOnly: false,
      images: [],
      thumbnail: ''
    })).rejects.toThrow();
  });
});
