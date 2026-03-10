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
}

module.exports = LoyaltyLevelController;