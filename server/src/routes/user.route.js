const userRouter = require("express").Router();
const UserController = require("../controllers/User.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");



userRouter.get("/search",verifyAccessToken, UserController.searchUsers);

module.exports = userRouter;