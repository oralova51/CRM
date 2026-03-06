const orderRouter = require('express').Router();
const OrderController = require('../controllers/Order.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

orderRouter.post('/', verifyAccessToken, OrderController.createOrder);
orderRouter.get('/:id', OrderController.getOrderById);
orderRouter.put('/:id', OrderController.updateOrder);
orderRouter.delete('/:id', OrderController.deleteOrder);

module.exports = orderRouter;
