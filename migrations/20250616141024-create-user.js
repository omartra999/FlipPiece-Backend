'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firebaseUid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      stripeCustomerId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        comment: 'Stripe Customer ID for saved payments'
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      address:{
        allowNull: true,
        type: Sequelize.JSON
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING
      },
      isAdmin: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.addIndex('user', ['firebaseUid']);
    await queryInterface.addIndex('user', ['stripeCustomerId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};