'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM('fashion', 'möbel', 'design'),
        allowNull: false

      },
      stock: {
        type: Sequelize.INTEGER
      },
      options: {
        type: Sequelize.JSON
      },
      isShippable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isPickupOnly: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,

      },
      weight: {
        type: Sequelize.DECIMAL(8,2),
        allowNull: true,
        comment: 'Weight in kg, used for shipping calculations'
      },
      dimensions: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Dimensions in cm {length, width, height}, used for shipping calculations',
      },
      shippingClass: {
        type: Sequelize.ENUM('standard', 'express', 'fragile'),
        allowNull: true,
        comment: 'Shipping class for the product, used for shipping calculations'
      },
      hsCode: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Harmonized System Code for international shipping'
      },

      images: {
        type: Sequelize.JSON
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product');
  }
};