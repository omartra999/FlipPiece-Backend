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
    // await queryInterface.removeColumn('Users', 'password');
    // await queryInterface.removeColumn('Users', 'confirmationCode');
    // await queryInterface.removeColumn('Users', 'isActive');
    await queryInterface.addColumn('user', 'firebaseUid', { type: Sequelize.STRING, allowNull: false, unique: true });
    await queryInterface.addColumn('user', 'address', { type: Sequelize.JSON, allowNull: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('user', 'password', { type: Sequelize.STRING, allowNull: false });
    await queryInterface.addColumn('user', 'confirmationCode', { type: Sequelize.STRING,
      allowNull: true });
    await queryInterface.addColumn('user', 'isActive', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true });
    await queryInterface.removeColumn('user', 'firebaseUid');
    await queryInterface.removeColumn('user', 'address');
  }
};
