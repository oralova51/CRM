const { User } = require('../../db/models');

class UserService {
  // Найти пользователя по email
  static async getUserByEmail(email) {
    return (await User.findOne({ where: { email } }))?.get();
  }
  // Создаём пользователя в БД
  static async createNewUser(userData) {
    return (await User.create(userData))?.get();
  }
}

module.exports = UserService;
