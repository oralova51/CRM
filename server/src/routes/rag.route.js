const ragRouter = require('express').Router();
const ragController = require('../controllers/rag.controller');

ragRouter.post('/index', ragController.indexFile.bind(ragController));
ragRouter.post('/query', ragController.query.bind(ragController));
ragRouter.post('/clear', ragController.clearStorage.bind(ragController));

module.exports = ragRouter;