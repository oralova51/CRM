const LoyaltyLevelController = require('../controllers/LoyalityLevel.controller');
const loyaltyLevelRouter = require('express').Router();
const verifyAccessToken = require('../middlewares/verifyAccessToken');

loyaltyLevelRouter.get('/status', verifyAccessToken, LoyaltyLevelController.getUserDiscount);
loyaltyLevelRouter.get('/levels', verifyAccessToken, LoyaltyLevelController.getLoyaltyLevels);


module.exports = loyaltyLevelRouter;