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
    username: {type: DataTypes.STRING, allowNull: false, unique: true},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    firstName: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING, allowNull: false},
    isAdmin: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    address: {type: DataTypes.JSON, allowNull: true},
  
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
  });
  return User;
};