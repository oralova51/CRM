const measurementRouter = require("express").Router();
const MeasurementController = require("../controllers/Measurement.controller");
const verifyAccessToken = require("../middlewares/verifyAccessToken");
const upload = require("../configs/multer.config"); // импортируем multer

// Публичные маршруты (если нужны)
measurementRouter.get("/getall", MeasurementController.getAllMeasurement);

// Маршруты для администратора
measurementRouter.get(
  "/user/:userId", 
  verifyAccessToken, 
  MeasurementController.adminGetMeasurementByUserId
);

// Маршруты для авторизованных пользователей
measurementRouter
  .get("/byUser", verifyAccessToken, MeasurementController.getUserMeasurement)
  .post("/", verifyAccessToken, MeasurementController.createMeasurement)
  .put("/:id", verifyAccessToken, MeasurementController.updateMeasurement)
  .delete("/:id", verifyAccessToken, MeasurementController.deleteMeasurement);

// ✅ НОВЫЕ МАРШРУТЫ для работы с фото
measurementRouter
  .post(
    "/:id/photo-before", 
    verifyAccessToken, 
    upload.single('photo'), 
    MeasurementController.uploadPhotoBefore
  )
  .post(
    "/:id/photo-after", 
    verifyAccessToken, 
    upload.single('photo'), 
    MeasurementController.uploadPhotoAfter
  )
  .delete(
    "/:id/photo", 
    verifyAccessToken, 
    MeasurementController.deletePhoto
  );
  measurementRouter.post(
  "/with-photo",
  verifyAccessToken,
  upload.fields([
    { name: 'photo_before', maxCount: 1 },
    { name: 'photo_after', maxCount: 1 }
  ]),
  MeasurementController.createMeasurementWithPhoto
);

module.exports = measurementRouter;