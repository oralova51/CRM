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
          model: User, // ← используем импортированную модель
          attributes: ["name", "email", "phone"],
        },
        {
          model: Procedure, // ← используем импортированную модель
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
}

module.exports = BookingService;
