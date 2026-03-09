'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Procedures', [
      {
        name: 'Массаж тела по технологии LPG',
        description: 'Эстетическая не медицинская процедура, предполагающая активную стимуляцию кожных покровов и подкожно-жировой клетчатки.',
        duration_min: 40,
        price: 1800.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Массаж тела по технологии LPG',
        description: 'Эстетическая не медицинская процедура, предполагающая активную стимуляцию кожных покровов и подкожно-жировой клетчатки.',
        duration_min: 30,
        price: 1500.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sketch массаж',
        description: 'Эстетическая аппаратная процедура, направленная на моделирование контуров тела и уменьшение локальных жировых отложений с помощью ритмичной ротационно-вибрационной стимуляции тканей.',
        duration_min: 40,
        price: 2000.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Индиба (1 зона)',
        description: 'Эстетическая аппаратная процедура, направленная на восстановление тонуса кожи, улучшение микроциркуляции и ускорение регенерации тканей с помощью радиочастотной энергии.',
        duration_min: 30,
        price: 3000.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Турбо массаж для похудения',
        description: 'Интенсивная массажная техника, направленная на ускорение метаболизма и уменьшение объемов тела.',
        duration_min: 40,
        price: 1800.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Горячий массаж для похудения',
        description: 'Массаж с использованием разогревающих техник для усиления кровообращения и расщепления жировых отложений.',
        duration_min: 40,
        price: 1800.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'LPG массаж лица',
        description: 'Аппаратный вакуумный массаж лица, улучшающий тонус кожи, разглаживающий морщины и корректирующий овал лица.',
        duration_min: 30,
        price: 1500.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sketch массаж лица',
        description: 'Эстетическая аппаратная процедура для лица с использованием ротационно-вибрационной стимуляции тканей.',
        duration_min: 30,
        price: 1400.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Криолиполиз (манипула для тела)',
        description: 'Современная методика избавления от лишних объемов на теле, в основе которой лежит воздействие низких температур на подкожно-жировой слой.',
        duration_min: 30,
        price: 2700.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Криолиполиз (манипула для подбородка)',
        description: 'Точечное воздействие низкими температурами на область подбородка для уменьшения жировых отложений.',
        duration_min: 30,
        price: 1600.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'RF лифтинг для лица',
        description: 'Радиочастотный лифтинг для подтяжки кожи лица, улучшения контура и уменьшения морщин.',
        duration_min: 30,
        price: 2000.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'RF лифтинг для тела',
        description: 'Радиочастотная процедура для подтяжки кожи тела, уменьшения целлюлита и коррекции контуров.',
        duration_min: 30,
        price: 1500.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Кавитация',
        description: 'Эстетическая безинъекционная процедура для удаления нежелательной жировой прослойки в проблемных местах с помощью ультразвука.',
        duration_min: 30,
        price: 1500.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Обёртывания',
        description: 'Косметологическая процедура для коррекции фигуры, уменьшения объемов и улучшения состояния кожи.',
        duration_min: 30,
        price: 1500.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Миостимуляция',
        description: 'Эффективная процедура, оказывающая оздоровительный эффект для всего организма с помощью электрической стимуляции мышц.',
        duration_min: 30,
        price: 1500.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Прессотерапия',
        description: 'Эффективное улучшение кровообращения и снятие отёчности для стройной фигуры с помощью аппаратного массажа.',
        duration_min: 45,
        price: 1500.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'БиоФотон',
        description: 'Светотерапия для омоложения кожи, улучшения цвета лица и стимуляции регенерации клеток.',
        duration_min: 30,
        price: 1500.00,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Procedures', null, {});
  }
};