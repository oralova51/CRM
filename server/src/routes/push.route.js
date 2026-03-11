// server/src/routes/push.route.js
const pushRouter = require('express').Router();
const PushController = require('../controllers/Push.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

// Все маршруты требуют авторизации
pushRouter.use(verifyAccessToken);

// Получить публичный VAPID ключ (для подписки на клиенте)
pushRouter.get('/vapid-public-key', PushController.getVapidPublicKey);

// Сохранить подписку пользователя
pushRouter.post('/subscribe', PushController.saveSubscription);

// Удалить подписку (при выходе или отключении)
pushRouter.delete('/unsubscribe', PushController.removeSubscription);

// Получить все подписки пользователя (для отладки)
pushRouter.get('/my-subscriptions', PushController.getMySubscriptions);

pushRouter.post('/test', PushController.sendTestNotification);

module.exports = pushRouter;