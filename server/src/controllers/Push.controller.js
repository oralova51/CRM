// server/src/controllers/Push.controller.js
const { PushSubscription } = require('../../db/models');
const formatResponse = require('../utils/formatResponse');

class PushController {
    // 1. Отдаём публичный VAPID ключ клиенту
    static async getVapidPublicKey(req, res) {
        try {
            const publicKey = process.env.VAPID_PUBLIC_KEY;

            if (!publicKey) {
                return res.status(500).json(
                    formatResponse(500, 'VAPID ключ не настроен на сервере', null, 'VAPID_PUBLIC_KEY missing')
                );
            }

            res.status(200).json(
                formatResponse(200, 'Публичный ключ получен', publicKey)
            );
        } catch (error) {
            console.error('Get VAPID key error:', error);
            res.status(500).json(
                formatResponse(500, 'Ошибка сервера', null, error.message)
            );
        }
    }

    // 2. Сохраняем подписку от браузера
    static async saveSubscription(req, res) {
        try {
            const { user } = res.locals;
            const { endpoint, keys, userAgent } = req.body;

            // Валидация
            if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
                return res.status(400).json(
                    formatResponse(400, 'Неполные данные подписки', null, 'Missing required fields')
                );
            }

            // Проверяем, не существует ли уже такая подписка
            const existingSubscription = await PushSubscription.findOne({
                where: { endpoint }
            });

            if (existingSubscription) {
                // Если подписка уже есть, но принадлежит другому пользователю
                if (existingSubscription.user_id !== user.id) {
                    // Обновляем владельца (возможно, пользователь переустановил браузер)
                    existingSubscription.user_id = user.id;
                    existingSubscription.p256dh = keys.p256dh;
                    existingSubscription.auth = keys.auth;
                    existingSubscription.user_agent = userAgent || null;
                    await existingSubscription.save();

                    return res.status(200).json(
                        formatResponse(200, 'Подписка обновлена', existingSubscription)
                    );
                }

                return res.status(200).json(
                    formatResponse(200, 'Подписка уже существует', existingSubscription)
                );
            }

            // Создаём новую подписку
            const newSubscription = await PushSubscription.create({
                user_id: user.id,
                endpoint,
                p256dh: keys.p256dh,
                auth: keys.auth,
                user_agent: userAgent || null
            });

            console.log(`✅ New push subscription saved for user ${user.id}`);

            res.status(201).json(
                formatResponse(201, 'Подписка успешно сохранена', newSubscription)
            );
        } catch (error) {
            console.error('Save subscription error:', error);
            res.status(500).json(
                formatResponse(500, 'Ошибка при сохранении подписки', null, error.message)
            );
        }
    }

    // 3. Удаляем подписку
    static async removeSubscription(req, res) {
        try {
            const { user } = res.locals;
            const { endpoint } = req.body;

            if (!endpoint) {
                return res.status(400).json(
                    formatResponse(400, 'Не указан endpoint', null, 'Endpoint is required')
                );
            }

            // Находим подписку
            const subscription = await PushSubscription.findOne({
                where: { endpoint }
            });

            // Если подписка не найдена — уже удалена
            if (!subscription) {
                return res.status(200).json(
                    formatResponse(200, 'Подписка уже удалена')
                );
            }

            // Проверяем, что подписка принадлежит текущему пользователю
            if (subscription.user_id !== user.id) {
                return res.status(403).json(
                    formatResponse(403, 'Нет прав для удаления этой подписки', null, 'Forbidden')
                );
            }

            await subscription.destroy();

            console.log(`✅ Push subscription removed for user ${user.id}`);

            res.status(200).json(
                formatResponse(200, 'Подписка успешно удалена')
            );
        } catch (error) {
            console.error('Remove subscription error:', error);
            res.status(500).json(
                formatResponse(500, 'Ошибка при удалении подписки', null, error.message)
            );
        }
    }

    // 4. Получить все подписки пользователя (для отладки)
    static async getMySubscriptions(req, res) {
        try {
            const { user } = res.locals;

            const subscriptions = await PushSubscription.findAll({
                where: { user_id: user.id },
                attributes: ['id', 'endpoint', 'user_agent', 'created_at'],
                order: [['created_at', 'DESC']]
            });

            res.status(200).json(
                formatResponse(200, 'Подписки получены', subscriptions)
            );
        } catch (error) {
            console.error('Get subscriptions error:', error);
            res.status(500).json(
                formatResponse(500, 'Ошибка при получении подписок', null, error.message)
            );
        }
    }

    /**
   * Тестовый эндпоинт для отправки пробного уведомления
   * В продакшене лучше убрать или защитить дополнительно
   */
    static async sendTestNotification(req, res) {
        try {
            const { user } = res.locals;
            const PushService = require('../services/Push.Service');

            const result = await PushService.sendTestNotification(user.id);

            res.status(200).json(
                formatResponse(200, 'Тестовое уведомление отправлено', result)
            );
        } catch (error) {
            console.error('Test notification error:', error);
            res.status(500).json(
                formatResponse(500, 'Ошибка при отправке тестового уведомления', null, error.message)
            );
        }
    }
}

module.exports = PushController;