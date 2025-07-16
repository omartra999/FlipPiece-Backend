const { Product } = require('../models');
const {
  Op, fn, col, where, literal
} = require('sequelize');

exports.createProduct = async (data) => {
  const parsedOptions = typeof data.options === 'string' ? JSON.parse(data.options) : data.options;
  return Product.create({
    ...data,
    options: parsedOptions
  });
};

exports.getAllProducts = async () => {
  return Product.findAll({
    attributes: [
      'id',
      'title',
      'description',
      'price',
      'category',
      'stock',
      'options',
      'isShippable',
      'isPickupOnly',
      'images',
      'thumbnail'
    ],
    order: [
      [
        'createdAt',
        'DESC'
      ]
    ]
  });
};

exports.getProductById = async (id) => {
  return Product.findByPk(id, {
    attributes: [
      'id',
      'title',
      'description',
      'price',
      'category',
      'stock',
      'options',
      'isShippable',
      'isPickupOnly',
      'images',
      'thumbnail'
    ]
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
    where: {
      category
    },
    attributes: [
      'id',
      'title',
      'description',
      'price',
      'category',
      'stock',
      'options',
      'isShippable',
      'isPickupOnly',
      'images',
      'thumbnail'
    ],
    order: [
      [
        'createdAt',
        'DESC'
      ]
    ]
  });
};
exports.searchProducts = async (query) => {
  const dialect = Product.sequelize.getDialect();
  let whereClause;

  if (dialect === 'postgres') {
    whereClause = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${query}%`
          }
        },
        {
          description: {
            [Op.iLike]: `%${query}%`
          }
        },
        // This allows searching the category as text (case-insensitive)
        literal(`CAST("category" AS TEXT) ILIKE '%${query}%'`)
      ]
    };
  } else {
    const lowerQuery = query.toLowerCase();
    whereClause = {
      [Op.or]: [
        where(fn('lower', col('title')), {
          [Op.like]: `%${lowerQuery}%`
        }),
        where(fn('lower', col('description')), {
          [Op.like]: `%${lowerQuery}%`
        }),
        where(fn('lower', col('category')), {
          [Op.like]: `%${lowerQuery}%`
        })
      ]
    };
  }

  try {
    return await Product.findAll({
      where: whereClause,
      attributes: [
        'id',
        'title',
        'description',
        'price',
        'category',
        'stock',
        'options',
        'isShippable',
        'isPickupOnly',
        'images',
        'thumbnail'
      ],
      order: [
        [
          'createdAt',
          'DESC'
        ]
      ]
    });
  } catch (error) {
    // Optionally, log a simple error for debugging
    // console.error('Error searching products:', error);
    throw error;
  }
};

exports.filterProducts = async (filters) => {
  const {
    category, priceRange, isShippable, isPickupOnly
  } = filters;
  const whereClause = {};

  if (category) whereClause.category = category;
  if (priceRange) {
    const [
      minPrice,
      maxPrice
    ] = priceRange.split('-').map(Number);
    whereClause.price = {
      [Op.between]: [
        minPrice,
        maxPrice
      ]
    };
  }
  if (isShippable !== undefined) whereClause.isShippable = isShippable === 'true';
  if (isPickupOnly !== undefined) whereClause.isPickupOnly = isPickupOnly === 'true';

  return Product.findAll({
    where: whereClause,
    attributes: [
      'id',
      'title',
      'description',
      'price',
      'category',
      'stock',
      'options',
      'isShippable',
      'isPickupOnly',
      'images',
      'thumbnail'
    ],
    order: [
      [
        'createdAt',
        'DESC'
      ]
    ]
  });
};
