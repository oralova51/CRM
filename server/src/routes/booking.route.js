const bookingRouter = require("express").Router();
const BookingController = require("../controllers/Booking.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");

// Все маршруты требуют аутентификации
bookingRouter.use(verifyAccessToken);

// Маршруты для клиента
bookingRouter.get("/my", BookingController.getMyBookings);
bookingRouter.get("/my/upcoming", BookingController.getMyUpcomingBookings);
bookingRouter.get("/my/past", BookingController.getMyPastBookings);
bookingRouter.post("/", BookingController.createBooking);

// Маршруты для админа
bookingRouter.get("/", BookingController.getAllBookings);
bookingRouter.put("/:id/status", BookingController.updateBookingStatus);

module.exports = bookingRouter;
