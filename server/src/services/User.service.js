const { Op } = require("sequelize");
const { User } = require("../../db/models");

class UserService {
  // Найти пользователя по email
  static async getUserByEmail(email) {
    return (await User.findOne({ where: { email } }))?.get();
  }
  // Создаём пользователя в БД
  static async createNewUser(userData) {
    return (await User.create(userData))?.get();
  }
  static async totalSpentChanger(userId, amount) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Получаем текущее значение как число (из-за геттера в модели)
      const currentTotal = parseFloat(user.totalSpent) || 0;

      // Преобразуем amount в число с 2 знаками после запятой
      const amountToAdd = parseFloat(amount);
      if (isNaN(amountToAdd)) {
        throw new Error("Amount must be a valid number");
      }

      // Вычисляем новое значение с правильной точностью
      const newTotal = (currentTotal + amountToAdd).toFixed(2);

      // Обновляем пользователя
      await user.update({ totalSpent: newTotal });

      // Возвращаем обновленного пользователя
      return user.get();
    } catch (error) {
      console.error("Error in totalSpentChanger:", error);
      throw error;
    }
  }
static async searchUsers(query){
  const users = await User.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
        { phone: { [Op.iLike]: `%${query}%` } },
      ],
    },
    attributes: ["id", "name", "email", "phone","role", "totalSpent"],
    limit: 10,
    order: [["name", "ASC"]],
  });
  return users;
}

}

module.exports = UserService;
