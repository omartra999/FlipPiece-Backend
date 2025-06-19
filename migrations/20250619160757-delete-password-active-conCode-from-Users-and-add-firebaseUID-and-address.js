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
    await queryInterface.addColumn('Users', 'firebaseUid', { type: Sequelize.STRING, allowNull: false, unique: true });
    await queryInterface.addColumn('Users', 'address', { type: Sequelize.JSON, allowNull: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('Users', 'password', { type: Sequelize.STRING, allowNull: false });
    await queryInterface.addColumn('Users', 'confirmationCode', { type: Sequelize.STRING,
      allowNull: true });
    await queryInterface.addColumn('Users', 'isActive', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true });
    await queryInterface.removeColumn('Users', 'firebaseUid');
    await queryInterface.removeColumn('Users', 'address');
  }
};
