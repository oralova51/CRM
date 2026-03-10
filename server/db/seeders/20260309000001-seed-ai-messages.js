"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id ASC LIMIT 3;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.warn("No users found. Run user seeds first.");
      return;
    }

    const userId1 = users[0].id;
    const userId2 = users[1]?.id ?? userId1;
    const userId3 = users[2]?.id ?? userId1;

    const now = new Date();
    const minutesAgo = (n) => new Date(now.getTime() - n * 60 * 1000);

    await queryInterface.bulkInsert("AiMessages", [
      // Диалог 1 — пользователь 1 спрашивает о записи
      {
        user_id: userId1,
        role: "user",
        content: "Привет! Хочу записаться на маникюр на следующей неделе. Какие есть свободные слоты?",
        created_at: minutesAgo(50),
      },
      {
        user_id: userId1,
        role: "assistant",
        content: "Здравствуйте! Рада помочь. На следующей неделе доступны: вторник 14:00, среда 11:00 и 16:30, пятница 10:00 и 15:00. Какой вариант вам подходит?",
        created_at: minutesAgo(49),
      },
      {
        user_id: userId1,
        role: "user",
        content: "Среда в 16:30 отлично подходит. Можете записать меня?",
        created_at: minutesAgo(48),
      },
      {
        user_id: userId1,
        role: "assistant",
        content: "Отлично! Я записала вас на среду в 16:30. За день до визита вы получите напоминание. Хотите также добавить дизайн или покрытие гель-лаком?",
        created_at: minutesAgo(47),
      },

      // Диалог 2 — пользователь 2 спрашивает об акциях
      {
        user_id: userId2,
        role: "user",
        content: "Добрый день! Есть ли сейчас какие-то акции или скидки?",
        created_at: minutesAgo(30),
      },
      {
        user_id: userId2,
        role: "assistant",
        content: "Добрый день! Сейчас действует акция: при заказе от 3000 ₽ скидка 15% на следующий визит. Также клиенты с уровнем лояльности Gold получают бесплатный уход для ногтей при любой процедуре. Хотите узнать подробнее?",
        created_at: minutesAgo(29),
      },
      {
        user_id: userId2,
        role: "user",
        content: "Да, расскажите подробнее о программе лояльности.",
        created_at: minutesAgo(28),
      },
      {
        user_id: userId2,
        role: "assistant",
        content: "Программа лояльности включает 3 уровня: Silver (от 5 000 ₽), Gold (от 15 000 ₽) и Platinum (от 30 000 ₽). Чем выше уровень, тем больше бонусов: приоритетная запись, бесплатные дополнительные услуги и эксклюзивные скидки. Ваш текущий уровень можно посмотреть в профиле.",
        created_at: minutesAgo(27),
      },

      // Диалог 3 — пользователь 3 задаёт вопрос о процедуре
      {
        user_id: userId3,
        role: "user",
        content: "Сколько длится процедура наращивания ногтей?",
        created_at: minutesAgo(10),
      },
      {
        user_id: userId3,
        role: "assistant",
        content: "Наращивание ногтей в среднем занимает 2–2,5 часа в зависимости от выбранного материала (гель или акрил) и сложности дизайна. Для первичного наращивания рекомендуем закладывать 2,5 часа. Хотите записаться?",
        created_at: minutesAgo(9),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("AiMessages", null, {});
  },
};
