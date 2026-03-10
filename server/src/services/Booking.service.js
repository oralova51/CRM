// server/src/services/Booking.service.js

const { Booking, User, Procedure } = require("../../db/models");
const { Op } = require("sequelize");

class BookingService {
  // Все записи конкретного клиента
  static async getUserBookings(userId) {
    return await Booking.findAll({
      where: { user_id: userId },
      order: [["scheduled_at", "DESC"]],
      include: [
        {
          model: Procedure,
          attributes: ["name", "duration_min", "price"],
        },
      ],
    });
  }

  // Все записи (для админа)
  static async getAllBookings() {
    return await Booking.findAll({
      order: [["scheduled_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["name", "email", "phone"],
        },
        {
          model: Procedure,
          attributes: ["name", "duration_min", "price"],
        },
      ],
    });
  }

  // Создание записи
  static async createBooking(data) {
    return await Booking.create(data);
  }

  // Обновление статуса
  static async updateBookingStatus(id, status) {
    const booking = await Booking.findByPk(id);
    if (!booking) return null;

    booking.status = status;
    await booking.save();
    return booking;
  }

  // Обновить статусы прошедших записей
  static async updatePastBookingsStatus() {
    const now = new Date();

    // Находим все записи с прошедшей датой, которые ещё не completed и не cancelled
    const pastPendingBookings = await Booking.findAll({
      where: {
        scheduled_at: { [Op.lt]: now },
        status: { [Op.in]: ["pending", "confirmed"] },
      },
    });

    console.log(`Found ${pastPendingBookings.length} past bookings to update`);

    // Обновляем их статус на 'completed'
    for (const booking of pastPendingBookings) {
      booking.status = "completed";
      await booking.save();
      console.log(`Updated booking ${booking.id} from pending to completed`);
    }

    return pastPendingBookings.length;
  }

  // Получить все записи пользователя с автоматическим обновлением статусов
  static async getUserBookingsWithAutoUpdate(userId) {
    // Сначала обновляем статусы
    await this.updatePastBookingsStatus();

    // Потом возвращаем актуальные записи
    return await this.getUserBookings(userId);
  }

  // Получить все записи для админа с автоматическим обновлением статусов
  static async getAllBookingsWithAutoUpdate() {
    // Сначала обновляем статусы
    await this.updatePastBookingsStatus();

    // Потом возвращаем актуальные записи
    return await this.getAllBookings();
  }

  // Предстоящие записи клиента
  static async getUpcomingBookings(userId) {
    const now = new Date();
    return await Booking.findAll({
      where: {
        user_id: userId,
        scheduled_at: { [Op.gt]: now },
        status: { [Op.notIn]: ["cancelled", "completed"] },
      },
      order: [["scheduled_at", "ASC"]],
      include: [
        {
          model: Procedure,
          attributes: ["name", "duration_min", "price"],
        },
      ],
    });
  }

  // Прошедшие записи клиента
  static async getPastBookings(userId) {
    const now = new Date();
    return await Booking.findAll({
      where: {
        user_id: userId,
        [Op.or]: [
          { scheduled_at: { [Op.lt]: now } },
          { status: { [Op.in]: ["completed", "cancelled"] } },
        ],
      },
      order: [["scheduled_at", "DESC"]],
      include: [
        {
          model: Procedure,
          attributes: ["name", "duration_min", "price"],
        },
      ],
    });
  }

  static async getBookingById(id) {
    return await Booking.findByPk(id, {
      include: [
        {
          model: Procedure,
          attributes: ["name", "duration_min", "price"],
        },
      ],
    });
  }
}

module.exports = BookingService;
