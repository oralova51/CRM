// const { Task } = require('../../db/models');

// // Сервис будет реализовывать набор CRUD-операций

// class TaskService {
//   // Получаем все задачи
//   static async getAllTasks() {
//     return await Task.findAll();
//   }
//   // Получаем одну задачу по ID
//   static async getTaskById(id) {
//     return await Task.findByPk(id);
//   }
//   // Создаем новую задачу
//   static async createNewTask(taskData) {
//     return await Task.create(taskData);
//   }

//   // Удаляем задачу по ID
//   static async deleteTaskById(id) {
//     const taskToDelete = await Task.findByPk(id);

//     // Если такой задачи не существует, вернем null
//     if (!taskToDelete) return null;

//     return await taskToDelete.destroy();
//   }

//   // Обновляем задачу по ID
//   static async updateTaskById(id, taskData) {
//     const taskToUpdate = await Task.findByPk(id);

//     const { title, text } = taskData;

//     // Если такой задачи не существует, вернем null
//     if (!taskToUpdate) return null;

//     // Точечно обновляем поля в объекте задачи
//     if (title) {
//       taskToUpdate.title = title;
//     }
//     if (text) {
//       taskToUpdate.text = text;
//     }
//     // сохраняем изменения в БД
//     await taskToUpdate.save();

//     return taskToUpdate;
//   }
// }

// module.exports = TaskService;
