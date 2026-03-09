'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Алексей Петров',
        email: 'aleksey.petrov@example.com',
        password: hashedPassword,
        phone: '+79161234567',
        totalSpent: 15200.50,
        role: 'isAdmin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Мария Иванова',
        email: 'maria.ivanova@example.com',
        password: hashedPassword,
        phone: '+79037654321',
        totalSpent: 4320.00,
        role: 'isClient',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Дмитрий Сидоров',
        email: 'dmitry.sidorov@example.com',
        password: hashedPassword,
        phone: '+79261112233',
        totalSpent: 890.75,
        role: 'isClient',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Екатерина Козлова',
        email: 'ekaterina.kozlova@example.com',
        password: hashedPassword,
        phone: +79213678484,
        totalSpent: 0.00,
        role: 'isClient',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Сергей Новиков',
        email: 'sergey.novikov@example.com',
        password: hashedPassword,
        phone: '+79854449900',
        totalSpent: 67450.00,
        role: 'isAdmin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'DAN',
        email: 'test3@mail.ru',
        password: await bcrypt.hash('Test3@mail.ru', 10),
        phone: '+79997779977',
        totalSpent: 1000,
        role: 'isClient',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Olya2@mail.ru',
        email: 'olya2@mail.ru',
        password: hashedPassword,
        phone: '+79854449900',
        totalSpent: 67450.00,
        role: 'isAdmin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};