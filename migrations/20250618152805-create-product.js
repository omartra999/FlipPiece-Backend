'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
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
        type: Sequelize.ENUM('fashion', 'möbel', 'Design'),
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
      images: {
        type: Sequelize.JSON
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
    await queryInterface.dropTable('Products');
  }
};