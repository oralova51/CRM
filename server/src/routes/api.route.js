const apiRouter = require('express').Router();
// const taskRouter = require('./task.route');/
const authRouter = require('./auth.route');
const formatResponse = require('../utils/formatResponse');

// apiRouter.use('/tasks', taskRouter);
apiRouter.use('/auth', authRouter);

// Обрабатываем несуществующие пути в API
apiRouter.use((req, res) => {
  return res.status(404).json(formatResponse(404, 'Ресурс не найден'));
});

module.exports = apiRouter;
