// server/src/cron/bookingReminders.js
const cron = require('node-cron');
const PushService = require('../services/Push.Service');

// Настройки уведомлений
const NOTIFICATION_TIMES = [
  { minutes: 120, message: '2 часа' },   // за 2 часа
  { minutes: 60, message: '1 час' },      // за 1 час
  { minutes: 30, message: '30 минут' }    // за 30 минут
];

/**
 * Отправляет уведомления для всех настроенных интервалов
 */
async function sendAllReminders() {
  console.log('\n⏰ === Push Notification Cron Job Started ===');
  console.log(`📅 Time: ${new Date().toLocaleString('ru-RU')}`);

  try {
    for (const time of NOTIFICATION_TIMES) {
      console.log(`\n🔔 Sending reminders for ${time.message} before booking...`);
      
      const results = await PushService.sendBookingReminders(time.minutes);
      
      console.log(`📊 Results for ${time.message}:`);
      console.log(`   - Total bookings: ${results.total}`);
      console.log(`   - Sent: ${results.sent}`);
      console.log(`   - Failed: ${results.failed}`);
      
      if (results.details.length > 0) {
        console.log('   - Details:', results.details);
      }
    }
  } catch (error) {
    console.error('❌ Cron job error:', error);
  }

  console.log('\n✅ === Push Notification Cron Job Finished ===\n');
}

// Настраиваем расписание
// * * * * * - формат cron: минута, час, день месяца, месяц, день недели

// Запускаем каждые 15 минут для проверки всех интервалов
// (0,15,30,45 * * * * - каждые 15 минут)
cron.schedule('*/15 * * * *', () => {
  console.log('⏰ Running scheduled push notifications check...');
  sendAllReminders();
});

// Для отладки можно запустить сразу при старте (закомментировать в продакшене)
// setTimeout(() => {
//   console.log('🔧 Running test check on startup...');
//   sendAllReminders();
// }, 5000);

console.log('📅 Push notification scheduler initialized');
console.log('⏱️  Will run every 15 minutes');
console.log('🔔 Notification times:', NOTIFICATION_TIMES.map(t => t.message).join(', '));

module.exports = { sendAllReminders };