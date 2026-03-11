const apiRouter = require('express').Router();
const procedureRouter = require('./procedure.route');
const authRouter = require('./auth.route');
const loyaltyLevelRouter = require('./loyaltyLevel.route');
const formatResponse = require('../utils/formatResponse');
const measurementRouter = require('./measurement.route');
const orderRouter = require('./order.route');
const bookingRouter = require('./booking.route');
const adminRouter = require('./admin.route');
const aiRouter = require('./ai.route');
const pushRouter = require('./push.route'); 

apiRouter.use('/auth', authRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/measurements', measurementRouter);
apiRouter.use('/order', orderRouter);
apiRouter.use('/procedure', procedureRouter);
apiRouter.use('/loyalty', loyaltyLevelRouter);
apiRouter.use('/booking', bookingRouter);
apiRouter.use('/admin', adminRouter)
apiRouter.use('/bookings', bookingRouter);
apiRouter.use('/push', pushRouter);

// Обрабатываем несуществующие пути в API
apiRouter.use((req, res) => {
  return res.status(404).json(formatResponse(404, 'Ресурс не найден'));
});

module.exports = apiRouter;
