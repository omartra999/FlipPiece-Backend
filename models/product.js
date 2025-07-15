'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    category: DataTypes.ENUM('fashion', 'möbel', 'design'),
    stock: DataTypes.INTEGER,
    options: DataTypes.JSON,
    isShippable: DataTypes.BOOLEAN,
    isPickupOnly: DataTypes.BOOLEAN,
    images: DataTypes.JSON,
    thumbnail: DataTypes.STRING,
    weight: {
      type: DataTypes.DECIMAL(8,2),
      allowNull: true,
      comment: 'Weight in kg, used for shipping calculations'
    },
    dimensions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Dimensions in cm {length, width, height}, used for shipping calculations'
    },
    shippingClass: {
      type: DataTypes.ENUM('standard', 'express', 'fragile'),
      allowNull: true,
      comment: 'Shipping class for the product, used for shipping calculations'
    },
    hsCode: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Harmonized System Code for international shipping'
    },

  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'product',
  });
  return Product;
};