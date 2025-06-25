const { Product } = require('../models');
const { Op, fn, col, where, literal } = require('sequelize');

exports.createProduct = async (data) => {
    const parsedOptions = typeof data.options === 'string' ? JSON.parse(data.options) : data.options;
    return Product.create({
        ...data,
        options: parsedOptions
    });
};

exports.getAllProducts = async () => {
    return Product.findAll({
        attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'],
        order: [['createdAt', 'DESC']]
    });
};

exports.getProductById = async (id) => {
    return Product.findByPk(id, {
        attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail']
    });
};

exports.updateProduct = async (id, data) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    const parsedOptions = typeof data.options === 'string' ? JSON.parse(data.options) : data.options;
    await product.update({
        ...data,
        options: parsedOptions
    });
    return product;
};

exports.deleteProduct = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return true;
};

exports.getProductsByCategory = async (category) => {
    return Product.findAll({
        where: { category },
        attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'],
        order: [['createdAt', 'DESC']]
    });
};

exports.searchProducts = async (query) => {
  try {
    process.stderr.write('=== SEARCH PRODUCTS START ===\n');
    process.stderr.write(`Query: ${query}\n`);
    
    const dialect = Product.sequelize.getDialect();
    process.stderr.write(`Dialect: ${dialect}\n`);
    
    let whereClause;

    if (dialect === 'postgres') {
      process.stderr.write('Using PostgreSQL syntax\n');
      whereClause = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          literal(`CAST("category" AS TEXT) ILIKE '%${query}%'`)
        ]
      };
    } else {
      process.stderr.write('Using SQLite/MySQL syntax\n');
      // For SQLite/MySQL: lower both sides for case-insensitive search
      const lowerQuery = query.toLowerCase();
      whereClause = {
        [Op.or]: [
          where(fn('lower', col('title')), { [Op.like]: `%${lowerQuery}%` }),
          where(fn('lower', col('description')), { [Op.like]: `%${lowerQuery}%` }),
          where(fn('lower', col('category')), { [Op.like]: `%${lowerQuery}%` })
        ]
      };
    }
    
    process.stderr.write(`WhereClause: ${JSON.stringify(whereClause, null, 2)}\n`);
    process.stderr.write('About to call Product.findAll\n');

    const result = await Product.findAll({
      where: whereClause,
      attributes: [
        'id', 'title', 'description', 'price', 'category', 'stock',
        'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'
      ],
      order: [['createdAt', 'DESC']]
    });
    
    process.stderr.write(`Found ${result.length} products\n`);
    process.stderr.write('=== SEARCH PRODUCTS SUCCESS ===\n');
    return result;
    
  } catch (error) {
    process.stderr.write('=== SEARCH PRODUCTS ERROR ===\n');
    process.stderr.write('FULL ERROR: ' + error + '\n');
    process.stderr.write('====================\n');
    process.stderr.write(JSON.stringify(error, null, 2) + '\n');
    if (error.parent) process.stderr.write('PG ERROR: ' + JSON.stringify(error.parent, null, 2) + '\n');
    if (error.original) process.stderr.write('ORIGINAL ERROR: ' + JSON.stringify(error.original, null, 2) + '\n');
    if (error.message) process.stderr.write('ERROR MESSAGE: ' + error.message + '\n');
    if (error.stack) process.stderr.write('STACK: ' + error.stack + '\n');
    process.stderr.write('====================\n');
    
    // Force flush and wait a bit
    process.stderr.write('Flushing stderr...\n');
    await new Promise(resolve => {
      process.stderr.write('', resolve);
    });
    await new Promise(resolve => setTimeout(resolve, 200));
    
    throw error;
  }
};

exports.filterProducts = async (filters) => {
    const { category, priceRange, isShippable, isPickupOnly } = filters;
    const whereClause = {};

    if (category) whereClause.category = category;
    if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
        whereClause.price = { [Op.between]: [minPrice, maxPrice] };
    }
    if (isShippable !== undefined) whereClause.isShippable = isShippable === 'true';
    if (isPickupOnly !== undefined) whereClause.isPickupOnly = isPickupOnly === 'true';

    return Product.findAll({
        where: whereClause,
        attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'options', 'isShippable', 'isPickupOnly', 'images', 'thumbnail'],
        order: [['createdAt', 'DESC']]
    });
};