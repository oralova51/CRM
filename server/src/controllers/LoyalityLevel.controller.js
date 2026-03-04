const LoyaltyLevelService = require('../services/LoyaltyLevel.service');
const formatResponse = require('../utils/formatResponse');

class LoyaltyLevelController {
  static async getUserDiscount(req, res) {
    try {
      const { user } = res.locals;
      console.log(user);
      const userId = user.id;
      const discount = await LoyaltyLevelService.getUserDiscount(userId);
      res.json(formatResponse(true, { discount }));
    } catch (error) {
      console.error('Error fetching user discount:', error);
      res.status(500).json(formatResponse(false, null, 'Failed to fetch user discount'));
    }
  }
  static async getLoyaltyLevels(req, res) {
    try {
      const loyaltyLevels = await LoyaltyLevelService.getLoyaltyLevels();
      res.json(formatResponse(true, { loyaltyLevels }));
    } catch (error) {
      console.error('Error fetching loyalty levels:', error);
      res.status(500).json(formatResponse(false, null, 'Failed to fetch loyalty levels'));
    }
  }
}

module.exports = LoyaltyLevelController;