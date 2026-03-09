const aiRouter = require("express").Router();
const AiController = require("../controllers/Ai.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

aiRouter.use(verifyAccessToken);

aiRouter.get("/history", AiController.getChatHistory);
aiRouter.post("/chat", AiController.sendMessage);

module.exports = aiRouter;
