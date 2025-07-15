'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, { foreignKey: 'firebaseUid', sourceKey: 'firebaseUid' });
    }
  }
  User.init({
    firebaseUid: {type: DataTypes.STRING, allowNull: false, unique: true},
    stripeCustomerId: {type: DataTypes.STRING, allowNull: true, unique: true, comment: 'Stripe Customer ID for saved payments'},
    username: {type: DataTypes.STRING, allowNull: false, unique: true},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    firstName: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING, allowNull: false},
    isAdmin: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    address: {type: DataTypes.JSON, allowNull: true, validate: {
      isValidAddress(value) {
        if (value && (!value.street || !value.city || !value.postalCode || !value.country)) {
          throw new Error('Address must include street, city, postalCode, and country');
        }
      }
    }},
  
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
  });
  return User;
};