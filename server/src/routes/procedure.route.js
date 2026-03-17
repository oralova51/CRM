const procedureRouter = require("express").Router();
const ProcedureController = require("../controllers/Procedure.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const verifyAccessTokenOptional = require("../middlewares/verifyAccessTokenOptional");

procedureRouter.get('/', verifyAccessTokenOptional, ProcedureController.getProcedures);
procedureRouter.get('/:id', ProcedureController.getOneProcedure);

procedureRouter
  .use(verifyAccessToken)
  .post("/", ProcedureController.createProcedure)
  .put("/:id", ProcedureController.updateProcedure)
  .delete("/:id", ProcedureController.deleteProcedure);

module.exports = procedureRouter;
