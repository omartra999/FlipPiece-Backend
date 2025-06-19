'use strict';

const { up } = require('./20250618181134-demo-users');

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
    await queryInterface.bulkInsert('Products', [
      {
        title: 'Stylish T-Shirt',
        description: 'A comfortable and stylish t-shirt made from organic cotton.',
        price: 19.99,
        category: 'fashion',
        stock: 100,
        options: JSON.stringify({ sizes: ['S', 'M', 'L', 'XL'], colors: ['red', 'blue', 'green'] }),
        isShippable: true,
        isPickupOnly: false,
        images: JSON.stringify(['image1.jpg', 'image2.jpg']),
        thumbnail: 'thumbnail1.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Modern Coffee Table',
        description: 'A sleek coffee table that fits perfectly in any modern living room.',
        price: 89.99,
        category: 'möbel',
        stock: 50,
        options: JSON.stringify({ materials: ['wood', 'glass'], colors: ['black', 'white'] }),
        isShippable: true,
        isPickupOnly: false,
        images: JSON.stringify(['table1.jpg', 'table2.jpg']),
        thumbnail: 'table_thumbnail.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Designer Lamp',
        description: 'An elegant lamp that adds a touch of sophistication to your space.',
        price: 49.99,
        category: 'Design',
        stock: 30,
        options: JSON.stringify({ styles: ['modern', 'classic'], colors: ['gold', 'silver'] }),
        isShippable: true,
        isPickupOnly: false,
        images: JSON.stringify(['lamp1.jpg', 'lamp2.jpg']),
        thumbnail: 'lamp_thumbnail.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Products', {
      title: [
        'Stylish T-Shirt',
        'Modern Coffee Table',
        'Designer Lamp'
      ]
    }, {});
  }
};
