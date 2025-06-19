'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        firebaseUid: 'firebase-uid-1',
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firebaseUid: 'firebase-uid-2',
        username: 'jane_doe',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firebaseUid: 'firebase-uid-3',
        username: 'admin_user',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};