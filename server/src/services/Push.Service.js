// server/src/services/PushService.js
const webpush = require('web-push');
const { PushSubscription, Booking, User, Procedure } = require('../../db/models');
const { Op } = require('sequelize');

// Настройка VAPID (должна быть выполнена один раз при запуске)
webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

class PushService {
  /**
   * Отправить уведомление конкретному пользователю на все его устройства
   * @param {number} userId - ID пользователя
   * @param {string} title - Заголовок уведомления
   * @param {string} body - Текст уведомления
   * @param {Object} data - Дополнительные данные (url, bookingId и т.д.)
   * @returns {Promise<{success: number, failed: number}>}
   */
  static async sendToUser(userId, title, body, data = {}) {
    const result = {
      success: 0,
      failed: 0,
      errors: []
    };

    try {
      // Получаем все активные подписки пользователя
      const subscriptions = await PushSubscription.findAll({
        where: { user_id: userId }
      });

      if (!subscriptions || subscriptions.length === 0) {
        console.log(`ℹ️ No push subscriptions found for user ${userId}`);
        return result;
      }

      console.log(`📨 Sending push to user ${userId} (${subscriptions.length} devices)`);

      const payload = JSON.stringify({
        title,
        body,
        ...data,
        timestamp: Date.now(),
        icon: '/icon-192.png',
        badge: '/badge-72.png'
      });

      // Отправляем на каждое устройство
      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification({
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          }, payload);
          
          result.success++;
          console.log(`✅ Push sent to endpoint: ${sub.endpoint.substring(0, 30)}...`);
        } catch (error) {
          result.failed++;
          
          // Обрабатываем ошибки отправки
          if (error.statusCode === 410) {
            // Подписка устарела (пользователь отключил уведомления) - удаляем
            console.log(`🗑️ Removing expired subscription for user ${userId}`);
            await sub.destroy();
            result.errors.push({
              endpoint: sub.endpoint,
              error: 'Subscription expired (410)'
            });
          } else if (error.statusCode === 429) {
            // Слишком много запросов
            console.warn(`⚠️ Rate limited for user ${userId}`);
            result.errors.push({
              endpoint: sub.endpoint,
              error: 'Rate limited (429)'
            });
          } else {
            // Другие ошибки
            console.error(`❌ Push failed for user ${userId}:`, error.message);
            result.errors.push({
              endpoint: sub.endpoint,
              error: error.message
            });
          }
        }
      }

      console.log(`📊 Push result for user ${userId}: ${result.success} sent, ${result.failed} failed`);
      return result;
    } catch (error) {
      console.error(`❌ PushService.sendToUser error:`, error);
      throw error;
    }
  }

  /**
   * Найти все записи, которые будут через указанное количество минут
   * @param {number} minutes - Через сколько минут искать записи (по умолчанию 120)
   * @returns {Promise<Array>} Массив записей с включенными пользователями и процедурами
   */
  static async findBookingsForNotification(minutes = 120) {
    try {
      const now = new Date();
      
      // Вычисляем целевое время (например, через 2 часа)
      const targetTime = new Date(now.getTime() + minutes * 60000);
      
      // Создаем окно поиска (±1 минута от целевого времени)
      const timeMin = new Date(targetTime.getTime() - 60000); // минус минута
      const timeMax = new Date(targetTime.getTime() + 60000); // плюс минута

      console.log(`🔍 Looking for bookings between ${timeMin.toISOString()} and ${timeMax.toISOString()}`);

      // Ищем записи, которые будут через указанное время
      const bookings = await Booking.findAll({
        where: {
          scheduled_at: {
            [Op.between]: [timeMin, timeMax]
          },
          status: {
            [Op.in]: ['confirmed', 'pending'] // confirmed или pending
          }
        },
        include: [
          { 
            model: User, 
            attributes: ['id', 'name', 'email'] 
          },
          { 
            model: Procedure, 
            attributes: ['id', 'name', 'duration_min'] 
          }
        ],
        order: [['scheduled_at', 'ASC']]
      });

      console.log(`📅 Found ${bookings.length} upcoming bookings`);
      
      return bookings;
    } catch (error) {
      console.error('❌ PushService.findBookingsForNotification error:', error);
      throw error;
    }
  }

  /**
   * Отправить уведомления о предстоящих записях
   * @param {number} minutes - За сколько минут до записи отправлять (по умолчанию 120)
   * @returns {Promise<Object>} Результаты отправки
   */
  static async sendBookingReminders(minutes = 120) {
    const results = {
      total: 0,
      sent: 0,
      failed: 0,
      details: []
    };

    try {
      const bookings = await this.findBookingsForNotification(minutes);
      
      results.total = bookings.length;

      for (const booking of bookings) {
        const notificationResult = await this.sendToUser(
          booking.user_id,
          'Скоро процедура! ✨',
          `${booking.Procedure.name} через ${minutes} минут`,
          { 
            url: '/procedures',
            bookingId: booking.id,
            procedureName: booking.Procedure.name,
            scheduledAt: booking.scheduled_at
          }
        );

        results.details.push({
          bookingId: booking.id,
          userId: booking.user_id,
          procedureName: booking.Procedure.name,
          success: notificationResult.success,
          failed: notificationResult.failed
        });

        results.sent += notificationResult.success;
        results.failed += notificationResult.failed;

        // Небольшая задержка между отправками, чтобы не перегружать сервер
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return results;
    } catch (error) {
      console.error('❌ PushService.sendBookingReminders error:', error);
      throw error;
    }
  }

  /**
   * Отправить тестовое уведомление (для отладки)
   * @param {number} userId - ID пользователя
   * @returns {Promise<Object>}
   */
  static async sendTestNotification(userId) {
    return await this.sendToUser(
      userId,
      '🔔 Тестовое уведомление',
      'Если вы это видите, push-уведомления работают!',
      { url: '/', test: true }
    );
  }
}

module.exports = PushService;