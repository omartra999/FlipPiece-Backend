'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, {
        foreignKey: 'firebaseUid',
        targetKey: 'firebaseUid',
        as: 'user'
      });
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cartId',
        as: 'items'
      });
    }
  }
  Cart.init({
    firebaseUid: {type: DataTypes.STRING, allowNull: false, unique: true},
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};