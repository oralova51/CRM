const LoyaltyLevelService = require('../services/LoyaltyLevel.service');
const formatResponse = require('../utils/formatResponse');

class LoyaltyLevelController {
  static async getUserDiscount(req, res) {
    try {
      const { user } = res.locals;

      const discountData = await LoyaltyLevelService.getUserDiscount(user.id);

      res.json(
        formatResponse(
          200,
          "User discount fetched successfully",
          discountData
        )
      );
    } catch (error) {
      console.error("Error fetching user discount:", error);

      res
        .status(500)
        .json(formatResponse(500, "Failed to fetch user discount"));
    }
  }
  static async getLoyaltyLevels(req, res) {
    try {
      const loyaltyLevels = await LoyaltyLevelService.getLoyaltyLevels();
      res.json(formatResponse(200, 'Loyalty levels fetched successfully', { loyaltyLevels }));
    } catch (error) {
      console.error('Error fetching loyalty levels:', error);
      res.status(500).json(formatResponse(500, 'Failed to fetch loyalty levels'));
    }
  }

  static async getActivityStatistics(req, res) {
    try {
      const { user } = res.locals;
      const statistics = await LoyaltyLevelService.getActivityStatistics(user.id);
      res.json(
        formatResponse(200, 'Activity statistics fetched successfully', statistics)
      );
    } catch (error) {
      console.error('Error fetching activity statistics:', error);
      res
        .status(500)
        .json(formatResponse(500, 'Failed to fetch activity statistics'));
    }
  }

  static async getUserDiscountById(req, res) {
    try {
      const { userId } = req.params;
      const { user: adminUser } = res.locals;

      // Проверяем, что админ имеет доступ
      if (adminUser.role !== 'isAdmin') {
        return res.status(403).json(
          formatResponse(403, 'Доступ запрещен. Только для администраторов')
        );
      }

      const discountData = await LoyaltyLevelService.getUserDiscountById(userId);

      res.json(
        formatResponse(
          200,
          "User discount fetched successfully",
          discountData
        )
      );
    } catch (error) {
      console.error("Error fetching user discount by id:", error);

      if (error.message === "User not found") {
        return res.status(404).json(
          formatResponse(404, "Пользователь не найден")
        );
      }

      res.status(500).json(
        formatResponse(500, "Failed to fetch user discount")
      );
    }
  }
}

module.exports = LoyaltyLevelController;