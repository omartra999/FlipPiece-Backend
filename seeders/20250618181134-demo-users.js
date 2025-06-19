'use strict';
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  const hashed_password = await bcrypt.hash('Test1234!', 10);
   await queryInterface.bulkInsert('Users', [{
     username: 'john_doe',
     firstName: 'John',
     lastName: 'Doe',
     email: 'john@example.com',
     password: hashed_password,
     isAdmin: false,
     isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
     
   }], {});
    await queryInterface.bulkInsert('Users', [{
      username: 'jane_admin',
      firstName: 'Jane',
      lastName: 'Admin',
      email: 'jane@example.com',
      password: hashed_password,
      isAdmin: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    await queryInterface.bulkInsert('Users', [{
      username: 'alice_user',
      firstName: 'Alice',
      lastName: 'User',
      email: 'alice@example.com',
      password: hashed_password,
      isAdmin: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', {
      username: ['john_doe', 'jane_admin', 'alice_user']
    }, {});
    
  }
};
