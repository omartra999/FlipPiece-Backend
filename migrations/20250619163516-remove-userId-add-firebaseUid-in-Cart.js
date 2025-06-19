'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('Cart', 'userId');
    await queryInterface.addColumn('Cart', 'firebaseUid', { type: Sequelize.STRING, allowNull: false });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Cart', 'firebaseUid');
    await queryInterface.addColumn('Cart', 'userId', { type: Sequelize.INTEGER, allowNull: false });
  }
};
