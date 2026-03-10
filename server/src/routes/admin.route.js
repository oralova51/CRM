const adminRouter = require("express").Router();
const UserController = require("../controllers/User.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const MeasurementController = require("../controllers/Measurement.controller");

adminRouter
  .get("/user_search", verifyAccessToken, UserController.searchUsers)
  .get(
    "/measurements/user/:userId",
    verifyAccessToken,
    MeasurementController.adminGetMeasurementByUserId,
  );

module.exports = adminRouter;
