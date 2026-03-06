const BookingService = require("../services/Booking.service");
const formatResponse = require("../utils/formatResponse");
const { Procedure } = require("../../db/models");

class BookingController {
  // 1. GET /api/bookings/my — получить свои записи (для клиента)
  static async getMyBookings(req, res) {
    try {
      const { user } = res.locals;
      const bookings = await BookingService.getUserBookings(user.id);

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
  // 2. GET /api/bookings/my/upcoming — предстоящие записи клиента
  static async getMyUpcomingBookings(req, res) {
    try {
      const { user } = res.locals;
      const bookings = await BookingService.getUserUpcomingBookings(user.id);
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

  // 3. GET /api/bookings/my/past — прошедшие записи клиента
  static async getMyPastBookings(req, res) {
    try {
      const { user } = res.locals;
      const bookings = await BookingService.getUserPastBookings(user.id);
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

  // 4. POST /api/bookings — создать запись (для клиента)
  static async createBooking(req, res) {
    const { user } = res.locals;

    // Проверяем, что пользователь — клиент
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

    // Валидация обязательных полей
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

    try {
      // Здесь хорошо бы получить цену процедуры автоматически
      // Но пока передаем price_paid как null (или 0)
      const bookingData = {
        user_id: user.id, // ID берем из авторизованного пользователя
        procedure_id,
        scheduled_at,
        status: "pending", // статус по умолчанию
        notes: notes || null,
        price_paid: procedure.price, // или можно получить из Procedure
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
  // 5. GET /api/bookings — все записи (только для админа)
  static async getAllBookings(req, res) {
  const { user } = res.locals;
  
  // Проверяем, что пользователь — админ
  if (user.role !== "isAdmin") {
    return res.status(403).json(
      formatResponse(403, "Доступ запрещен. Только администраторы могут просматривать все записи", null, "Forbidden")
    );
  }

  try {
    const bookings = await BookingService.getAllBookings();
    
    res.status(200).json(
      formatResponse(200, "Все записи получены", bookings, null)
    );
  } catch (error) {
    console.error("==== BookingController.getAllBookings ====");
    console.error(error);
    res.status(500).json(
      formatResponse(500, "Ошибка при получении записей", null, error.message)
    );
  }
}

  // 6. PUT /api/bookings/:id/status — обновить статус (только для админа)
  static async updateBookingStatus(req, res) {
  const { user } = res.locals;
  const { id } = req.params;
  const { status } = req.body;

  // Проверяем, что пользователь — админ
  if (user.role !== "isAdmin") {
    return res.status(403).json(
      formatResponse(403, "Доступ запрещен. Только администраторы могут изменять статус записей", null, "Forbidden")
    );
  }

  // Валидация ID
  if (isNaN(Number(id))) {
    return res.status(400).json(
      formatResponse(400, "Некорректный формат ID", null, "Invalid ID format")
    );
  }

  // Валидация статуса
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json(
      formatResponse(400, "Некорректный статус", null, "Status must be one of: pending, confirmed, completed, cancelled")
    );
  }

  try {
    const updatedBooking = await BookingService.updateBookingStatus(Number(id), status);

    if (!updatedBooking) {
      return res.status(404).json(
        formatResponse(404, `Запись с ID ${id} не найдена`, null, "Booking not found")
      );
    }

    res.status(200).json(
      formatResponse(200, "Статус записи обновлен", updatedBooking, null)
    );
  } catch (error) {
    console.error("==== BookingController.updateBookingStatus ====");
    console.error(error);
    res.status(500).json(
      formatResponse(500, "Ошибка при обновлении статуса", null, error.message)
    );
  }
}

// Предстоящие записи клиента
static async getMyUpcomingBookings(req, res) {
  try {
    const { user } = res.locals;
    const bookings = await BookingService.getUpcomingBookings(user.id);
    
    res.status(200).json(
      formatResponse(200, "Предстоящие записи получены", bookings, null)
    );
  } catch (error) {
    console.error("==== BookingController.getMyUpcomingBookings ====");
    console.error(error);
    res.status(500).json(
      formatResponse(500, "Ошибка при получении предстоящих записей", null, error.message)
    );
  }
}

// Прошедшие записи клиента
static async getMyPastBookings(req, res) {
  try {
    const { user } = res.locals;
    const bookings = await BookingService.getPastBookings(user.id);
    
    res.status(200).json(
      formatResponse(200, "Прошедшие записи получены", bookings, null)
    );
  } catch (error) {
    console.error("==== BookingController.getMyPastBookings ====");
    console.error(error);
    res.status(500).json(
      formatResponse(500, "Ошибка при получении прошедших записей", null, error.message)
    );
  }
}
}
module.exports = BookingController;