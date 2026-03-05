const authRouter = require('express').Router();
const UserController = require('../controllers/User.controller');
const verifyRefreshToken = require('../middlewares/verifyRefreshToken');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

authRouter
  .post('/signup', UserController.signUp)
  .post('/signin', UserController.signIn)
  .get('/signout', UserController.signOut)
  .get('/me', verifyAccessToken, UserController.getMe)
  .get('/refresh', verifyRefreshToken, UserController.refreshTokens);

module.exports = authRouter;
