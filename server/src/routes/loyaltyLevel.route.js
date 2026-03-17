const LoyaltyLevelController = require('../controllers/LoyalityLevel.controller');
const loyaltyLevelRouter = require('express').Router();
const verifyAccessToken = require('../middlewares/verifyAccessToken');

loyaltyLevelRouter.get('/status', verifyAccessToken, LoyaltyLevelController.getUserDiscount);
loyaltyLevelRouter.get('/user/:userId', verifyAccessToken, LoyaltyLevelController.getUserDiscountById);
loyaltyLevelRouter.get('/levels', verifyAccessToken, LoyaltyLevelController.getLoyaltyLevels);
loyaltyLevelRouter.get('/statistics', verifyAccessToken, LoyaltyLevelController.getActivityStatistics);

module.exports = loyaltyLevelRouter;