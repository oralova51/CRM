const { LoyaltyLevel } = require("../../db/models");
const { User } = require("../../db/models");
const { Op } = require("sequelize");

class LoyaltyLevelService {
  static async getUserDiscount(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Используем правильное имя поля - totalSpent (как в модели)
    const totalSpent = parseFloat(user.totalSpent) || 0;

    console.log("Total spent:", totalSpent); // Должно быть 30000

    const loyaltyLevel = await LoyaltyLevel.findOne({
      where: {
        min_spent: {
          [Op.lte]: totalSpent,
        },
      },
      order: [["min_spent", "DESC"]],
    });

    if (!loyaltyLevel) {
      return {
        discount_pct: 0,
        name: "base",
        min_spent: 0,
      };
    }

    return {
      discount_pct: loyaltyLevel.discount_pct,
      name: loyaltyLevel.level,
      min_spent: loyaltyLevel.min_spent,
    };
  }

  // server/src/services/LoyaltyLevel.service.js
  static async getLoyaltyLevels() {
    const loyaltyLevels = await LoyaltyLevel.findAll({
      order: [['min_spent', 'ASC']],  // ← добавить сортировку
    });
    return loyaltyLevels;
  }
}

module.exports = LoyaltyLevelService;
