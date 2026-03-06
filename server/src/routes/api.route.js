const apiRouter = require('express').Router();
const procedureRouter = require('./procedure.route');
const authRouter = require('./auth.route');
const loyaltyLevelRouter = require('./loyaltyLevel.route');
const formatResponse = require('../utils/formatResponse');
const measurementRouter = require('./measurement.route');
const orderRouter = require('./order.route');
const bookingRouter = require('./booking.route');

apiRouter.use('/auth', authRouter);
apiRouter.use('/measurement', measurementRouter);
apiRouter.use('/order', orderRouter);
apiRouter.use('/procedure', procedureRouter);
apiRouter.use('/loyalty', loyaltyLevelRouter);
apiRouter.use('/booking', bookingRouter);

// Обрабатываем несуществующие пути в API
apiRouter.use((req, res) => {
  return res.status(404).json(formatResponse(404, 'Ресурс не найден'));
});

module.exports = apiRouter;
