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
    thumbnail: DataTypes.STRING}, {
    sequelize,
    modelName: 'Product',
    tableName: 'product',
  });
  return Product;
};