const procedureRouter = require("express").Router();
const ProcedureController = require("../controllers/Procedure.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

procedureRouter
  .use(verifyAccessToken)
  .get("/", ProcedureController.getProcedures)
  .get("/:id", ProcedureController.getOneProcedure)
  .post("/", ProcedureController.createProcedure)
  .put("/:id", ProcedureController.updateProcedure)
  .delete("/:id", ProcedureController.deleteProcedure);

module.exports = procedureRouter;
