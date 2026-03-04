const { LoyaltyLevel } = require("../../db/models");
const { User } = require("../../db/models");
const { Op } = require("sequelize");

class LoyaltyLevelService {
  static async getUserDiscount(userId) {
    const user = await User.findByPk(userId);

    const loyaltyLevel = await LoyaltyLevel.findOne({
      where: {
        min_spent: {
          [Op.lte]: user.total_spent,
        },
      },
      order: [["min_spent", "DESC"]],
    });

    return loyaltyLevel ? loyaltyLevel.discount_pct : 0;
  }

    static async getLoyaltyLevels() {
        const loyaltyLevels = await LoyaltyLevel.findAll();
        return loyaltyLevels;
    }
}

module.exports = LoyaltyLevelService;
