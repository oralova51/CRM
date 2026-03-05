const measurementRouter = require('express').Router();
const MeasurementController = require('../controllers/Measurement.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

measurementRouter
    .get('/byUser', verifyAccessToken, MeasurementController.getUserMeasurement)
    .post('/', verifyAccessToken, MeasurementController.createMeasurement)
    .put('/:id', verifyAccessToken, MeasurementController.updateMeasurement)
    .delete('/:id', verifyAccessToken, MeasurementController.deleteMeasurement);

module.exports = measurementRouter;