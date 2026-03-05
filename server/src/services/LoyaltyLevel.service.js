const { LoyaltyLevel } = require("../../db/models");
const { User } = require("../../db/models");
const { Op } = require("sequelize");

class LoyaltyLevelService {
  static async getUserDiscount(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const loyaltyLevel = await LoyaltyLevel.findOne({
      where: {
        min_spent: {
          [Op.lte]: user.total_spent,
        },
      },
      order: [["min_spent", "DESC"]],
    });

    if (!loyaltyLevel) {
      return {
        discount_pct: 0,
        level: "base",
        min_spent: 0,
      };
    }

    return {
      discount_pct: loyaltyLevel.discount_pct,
      level: loyaltyLevel.level,
      min_spent: loyaltyLevel.min_spent,
    };
  }

    static async getLoyaltyLevels() {
        const loyaltyLevels = await LoyaltyLevel.findAll();
        return loyaltyLevels;
    }
}

module.exports = LoyaltyLevelService;
