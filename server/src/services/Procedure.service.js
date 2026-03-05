const { Procedure } = require("../../db/models");

// Сервис будет реализовывать набор CRUD-операций

class ProcedureService {
  // Получаем все задачи
  static async getAllProcedures() {
    return await Procedure.findAll({
      order: [["name", "ASC"]],
    });
  }
  // Получаем одну процедуру по ID
  static async getProcedureById(id) {
    return await Procedure.findByPk(id);
  }
  // Создаем новую процедуру
  static async createNewProcedure(procedureData) {
    return await Procedure.create(procedureData);
  }

  // Удаляем процедуру по ID
  static async deleteProcedureById(id) {
    const procedureToDelete = await Procedure.findByPk(id);

    // Если такой процедуры не существует, вернем null
    if (!procedureToDelete) return null;

    return await procedureToDelete.destroy();
  }

  // Обновляем процедуру по ID
  static async updateProcedureById(id, procedureData) {
    const procedureToUpdate = await Procedure.findByPk(id);

    if (!procedureToUpdate) return null;

    const { name, description, duration_min, price, is_active } = procedureData;

    // Обновляем только те поля, которые пришли в запросе
    if (name !== undefined) procedureToUpdate.name = name;
    if (description !== undefined) procedureToUpdate.description = description;
    if (duration_min !== undefined)
      procedureToUpdate.duration_min = duration_min;
    if (price !== undefined) procedureToUpdate.price = price;
    if (is_active !== undefined) procedureToUpdate.is_active = is_active;

    await procedureToUpdate.save();
    return procedureToUpdate;
  }

  static async getActiveProcedures() {
  return await Procedure.findAll({
    where: { is_active: true },
    order: [['name', 'ASC']]
  });
}
}

module.exports = ProcedureService;
