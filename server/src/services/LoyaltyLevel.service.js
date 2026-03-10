const { LoyaltyLevel } = require("../../db/models");
const { User } = require("../../db/models");
const { Op } = require("sequelize");
const BookingService = require("./Booking.service");

class LoyaltyLevelService {
  static async getUserDiscount(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Используем правильное имя поля - totalSpent (как в модели)
    const totalSpent = parseFloat(user.totalSpent) || 0;

    console.log("Total spent:", totalSpent); // Должно быть 30000

    const loyaltyLevel = await LoyaltyLevel.findOne({
      where: {
        min_spent: {
          [Op.lte]: totalSpent,
        },
      },
      order: [["min_spent", "DESC"]],
    });

    if (!loyaltyLevel) {
      return {
        discount_pct: 0,
        name: "base",
        min_spent: 0,
      };
    }

    return {
      discount_pct: loyaltyLevel.discount_pct,
      name: loyaltyLevel.level,
      min_spent: loyaltyLevel.min_spent,
    };
  }

  // server/src/services/LoyaltyLevel.service.js
  static async getLoyaltyLevels() {
    const loyaltyLevels = await LoyaltyLevel.findAll({
      order: [['min_spent', 'ASC']],  // ← добавить сортировку
    });
    return loyaltyLevels;
  }

  /**
   * Статистика активности клиента: посещения и средний интервал между процедурами.
   * Средний интервал = среднее кол-во дней между последовательными завершёнными визитами.
   */
  static async getActivityStatistics(userId) {
    await BookingService.updatePastBookingsStatus();
    const pastBookings = await BookingService.getPastBookings(userId);

    const completedBookings = pastBookings.filter((b) => b.status === "completed");
    const visits = completedBookings.length;

    const uniqueDates = [
      ...new Set(
        completedBookings.map((b) =>
          new Date(b.scheduled_at).toISOString().slice(0, 10)
        )
      ),
    ].sort();

    let averageInterval = null;
    if (uniqueDates.length >= 2) {
      let totalDays = 0;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const d1 = new Date(uniqueDates[i]);
        const d2 = new Date(uniqueDates[i + 1]);
        totalDays += Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
      }
      averageInterval = Math.round(totalDays / (uniqueDates.length - 1));
    }

    return { visits, averageInterval };
  }
}

module.exports = LoyaltyLevelService;
