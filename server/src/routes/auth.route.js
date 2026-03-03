const authRouter = require('express').Router();
const UserController = require('../controllers/User.controller');
const verifyRefreshToken = require('../middlewares/verifyRefreshToken');

authRouter
  .post('/signup', UserController.signUp)
  .post('/signin', UserController.signIn)
  .get('/signout', UserController.signOut)
  .get('/refresh', verifyRefreshToken, UserController.refreshTokens);

module.exports = authRouter;
