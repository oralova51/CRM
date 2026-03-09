// server/src/controllers/Booking.controller.js

const BookingService = require("../services/Booking.service");
const { Procedure } = require("../../db/models");
const formatResponse = require("../utils/formatResponse");

class BookingController {
  // GET /api/bookings/my — получить свои записи (с автообновлением)
  static async getMyBookings(req, res) {
    try {
      const { user } = res.locals;
      // Используем новый метод с автообновлением
      const bookings = await BookingService.getUserBookingsWithAutoUpdate(
        user.id,
      );

      res
        .status(200)
        .json(
          formatResponse(
            200,
            bookings.length ? "Записи получены" : "У Вас пока нет записей",
            bookings,
            null,
          ),
        );
    } catch (error) {
      console.error("==== BookingController.getMyBookings ====");
      console.error(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при получении записей",
            null,
            error.message,
          ),
        );
    }
  }

  // GET /api/bookings/my/upcoming — предстоящие записи клиента
  static async getMyUpcomingBookings(req, res) {
    try {
      const { user } = res.locals;
      // Сначала обновляем статусы
      await BookingService.updatePastBookingsStatus();
      // Потом получаем предстоящие
      const bookings = await BookingService.getUpcomingBookings(user.id);

      res
        .status(200)
        .json(
          formatResponse(200, "Предстоящие записи получены", bookings, null),
        );
    } catch (error) {
      console.error("==== BookingController.getMyUpcomingBookings ====");
      console.error(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при получении предстоящих записей",
            null,
            error.message,
          ),
        );
    }
  }

  // GET /api/bookings/my/past — прошедшие записи клиента
  static async getMyPastBookings(req, res) {
    try {
      const { user } = res.locals;
      // Сначала обновляем статусы
      await BookingService.updatePastBookingsStatus();
      // Потом получаем прошедшие
      const bookings = await BookingService.getPastBookings(user.id);

      res
        .status(200)
        .json(formatResponse(200, "Прошедшие записи получены", bookings, null));
    } catch (error) {
      console.error("==== BookingController.getMyPastBookings ====");
      console.error(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при получении прошедших записей",
            null,
            error.message,
          ),
        );
    }
  }

  // POST /api/bookings — создать запись
  static async createBooking(req, res) {
    const { user } = res.locals;

    if (user.role !== "isClient") {
      return res
        .status(403)
        .json(
          formatResponse(
            403,
            "Доступ запрещен. Только клиенты могут создавать записи",
            null,
            "Forbidden",
          ),
        );
    }

    const { procedure_id, scheduled_at, notes } = req.body;

    if (!procedure_id) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Не выбрана процедура",
            null,
            "procedure_id is required",
          ),
        );
    }

    if (!scheduled_at) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Не указана дата и время",
            null,
            "scheduled_at is required",
          ),
        );
    }

    try {
      const procedure = await Procedure.findByPk(procedure_id);
      if (!procedure) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              "Процедура не найдена",
              null,
              "Procedure not found",
            ),
          );
      }

      const bookingData = {
        user_id: user.id,
        procedure_id,
        scheduled_at,
        status: "pending",
        notes: notes || null,
        price_paid: procedure.price,
      };

      const newBooking = await BookingService.createBooking(bookingData);

      res
        .status(201)
        .json(formatResponse(201, "Запись создана", newBooking, null));
    } catch (error) {
      console.error("==== BookingController.createBooking ====");
      console.error(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при создании записи",
            null,
            error.message,
          ),
        );
    }
  }

  // GET /api/bookings — все записи (только для админа)
  static async getAllBookings(req, res) {
    const { user } = res.locals;

    if (user.role !== "isAdmin") {
      return res
        .status(403)
        .json(
          formatResponse(
            403,
            "Доступ запрещен. Только администраторы могут просматривать все записи",
            null,
            "Forbidden",
          ),
        );
    }

    try {
      // Используем метод с автообновлением
      const bookings = await BookingService.getAllBookingsWithAutoUpdate();

      res
        .status(200)
        .json(formatResponse(200, "Все записи получены", bookings, null));
    } catch (error) {
      console.error("==== BookingController.getAllBookings ====");
      console.error(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при получении записей",
            null,
            error.message,
          ),
        );
    }
  }

  // PUT /api/bookings/:id/status — обновить статус
  static async updateBookingStatus(req, res) {
    const { user } = res.locals;
    const { id } = req.params;
    const { status } = req.body;

    // Валидация ID
    if (isNaN(Number(id))) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Некорректный формат ID",
            null,
            "Invalid ID format",
          ),
        );
    }

    // Валидация статуса
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Некорректный статус",
            null,
            "Status must be one of: pending, confirmed, completed, cancelled",
          ),
        );
    }

    try {
      // Получаем запись, чтобы проверить права
      const booking = await BookingService.getBookingById(Number(id));

      if (!booking) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Запись с ID ${id} не найдена`,
              null,
              "Booking not found",
            ),
          );
      }

      // Проверяем права:
      // 1. Админ может менять любой статус
      // 2. Клиент может отменить только свою запись (статус -> cancelled)
      // 3. Клиент НЕ может менять на другие статусы
      if (user.role !== "isAdmin") {
        // Проверяем, что запись принадлежит этому клиенту
        if (booking.user_id !== user.id) {
          return res
            .status(403)
            .json(
              formatResponse(
                403,
                "Доступ запрещен. Это не ваша запись",
                null,
                "Forbidden",
              ),
            );
        }

        // Клиент может только отменить запись (cancelled)
        if (status !== "cancelled") {
          return res
            .status(403)
            .json(
              formatResponse(
                403,
                "Клиент может только отменить запись",
                null,
                "Forbidden",
              ),
            );
        }

        // Клиент может отменить только запись со статусом pending
        if (booking.status !== "pending") {
          return res
            .status(400)
            .json(
              formatResponse(
                400,
                "Можно отменить только запись со статусом 'Ожидает'",
                null,
                "Cannot cancel non-pending booking",
              ),
            );
        }
      }

      const updatedBooking = await BookingService.updateBookingStatus(
        Number(id),
        status,
      );

      res
        .status(200)
        .json(
          formatResponse(200, "Статус записи обновлен", updatedBooking, null),
        );
    } catch (error) {
      console.error("==== BookingController.updateBookingStatus ====");
      console.error(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Ошибка при обновлении статуса",
            null,
            error.message,
          ),
        );
    }
  }
}

module.exports = BookingController;
