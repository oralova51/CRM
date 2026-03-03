// const TaskService = require('../service/Task.service');
// const formatResponse = require('../utils/formatResponse');

// class TaskController {
//   static async viewTasksPage(req, res) {
//     try {
//       const rawTasks = await TaskService.getAllTasks();

//       if (rawTasks.length === 0) {
//         return res
//           .status(200)
//           .json(formatResponse(200, 'В базе данных нет задач', [], null));
//       }

//       const tasks = rawTasks.map((task) => task.get());

//       res.send(`
//         <div style="width: 50vw; margin: 0 auto;">
//           <form
//         action="/api/tasks"
//         method="post"
//         style="display: flex; flex-direction: column; gap: 10px"
//       >
//         <input type="text" name="title" placeholder="Название" />
//         <input type="text" name="text" placeholder="Описание" />
//         <button type="submit">Отправить</button>
//       </form>
//           ${tasks
//             .map(
//               (task) => `
//             <div style="text-align: center; padding: 10px; margin: 15px 0; background-color: whitesmoke; border-radius: 8px; box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1)">
//               <h2>${task.title}</h2>
//               <p>${task.text}</p>
//             </div>
//             `,
//             )
//             .join('')
//             .replace(',', '')}
//         </div>
//         `);
//     } catch (error) {
//       console.log('==== TaskController.viewTasksPage ==== ');
//       console.log(error);
//       res
//         .status(500)
//         .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error));
//     }
//   }

//   static async getTasks(req, res) {
//     try {
//       const tasks = await TaskService.getAllTasks();

//       if (tasks.length === 0) {
//         return res
//           .status(200)
//           .json(formatResponse(200, 'В базе данных нет задач', [], null));
//       }

//       res
//         .status(200)
//         .json(formatResponse(200, 'Данные о задачах получены', tasks, null));
//     } catch (error) {
//       console.log('==== TaskController.getTasks ==== ');
//       console.log(error);
//       res
//         .status(500)
//         .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error));
//     }
//   }

//   static async getOneTask(req, res) {
//     const { id } = req.params;

//     if (isNaN(Number(id))) {
//       return res
//         .status(400)
//         .json(
//           formatResponse(
//             400,
//             'Некорректный формат ID',
//             null,
//             'Некорректный формат ID',
//           ),
//         );
//     }

//     try {
//       const task = await TaskService.getTaskById(Number(id));

//       if (!task) {
//         return res
//           .status(404)
//           .json(
//             formatResponse(
//               404,
//               `Задача с ID: ${id} не найдена`,
//               null,
//               `Задача с ID: ${id} не найдена`,
//             ),
//           );
//       }

//       res
//         .status(200)
//         .json(formatResponse(200, 'Данные о задаче получены', task, null));
//     } catch (error) {
//       console.log('==== TaskController.getOneTask ==== ');
//       console.log(error);
//       res
//         .status(500)
//         .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error));
//     }
//   }

//   static async createTask(req, res) {
//     const { title, text } = req.body;
//     const { user } = res.locals;

//     if (!title || typeof title !== 'string' || title.trim().length === 0) {
//       return res
//         .status(400)
//         .json(
//           formatResponse(
//             400,
//             'Название задачи не должно быть пустым',
//             null,
//             'Название задачи не должно быть пустым',
//           ),
//         );
//     }

//     if (!text || typeof text !== 'string' || text.trim().length === 0) {
//       return res
//         .status(400)
//         .json(
//           formatResponse(
//             400,
//             'Описание задачи не должно быть пустым',
//             null,
//             'Описание задачи не должно быть пустым',
//           ),
//         );
//     }

//     try {
//       const newTask = await TaskService.createNewTask({
//         title,
//         text,
//         user_id: user.id,
//       });

//       res
//         .status(201)
//         .json(formatResponse(201, 'Задача создана успешно', newTask, null));
//     } catch (error) {
//       console.log('==== TaskController.createTask ==== ');
//       console.log(error);
//       res
//         .status(500)
//         .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error));
//     }
//   }

//   static async deleteTask(req, res) {
//     const { id } = req.params;

//     if (isNaN(Number(id))) {
//       return res
//         .status(400)
//         .json(
//           formatResponse(
//             400,
//             'Некорректный формат ID',
//             null,
//             'Некорректный формат ID',
//           ),
//         );
//     }

//     try {
//       const deletedTask = await TaskService.deleteTaskById(Number(id));

//       if (!deletedTask) {
//         return res
//           .status(404)
//           .json(
//             formatResponse(
//               404,
//               `Задача с ID: ${id} не найдена`,
//               null,
//               `Задача с ID: ${id} не найдена`,
//             ),
//           );
//       }

//       res.status(200).json(formatResponse(200, 'Задача удалена успешно'));
//     } catch (error) {
//       console.log('==== TaskController.deleteTask ==== ');
//       console.log(error);
//       res
//         .status(500)
//         .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error));
//     }
//   }

//   static async updateTask(req, res) {
//     const { id } = req.params;
//     const { title, text } = req.body;

//     if (isNaN(Number(id))) {
//       return res
//         .status(400)
//         .json(
//           formatResponse(
//             400,
//             'Некорректный формат ID',
//             null,
//             'Некорректный формат ID',
//           ),
//         );
//     }

//     try {
//       const updatedTask = await TaskService.updateTaskById(Number(id), {
//         title,
//         text,
//       });

//       if (!updatedTask) {
//         return res
//           .status(404)
//           .json(
//             formatResponse(
//               404,
//               `Задача с ID: ${id} не найдена`,
//               null,
//               `Задача с ID: ${id} не найдена`,
//             ),
//           );
//       }

//       res
//         .status(200)
//         .json(formatResponse(200, 'Задача обновлена успешно', updatedTask));
//     } catch (error) {
//       console.log('==== TaskController.updateTask ==== ');
//       console.log(error);
//       res
//         .status(500)
//         .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error));
//     }
//   }
// }

// module.exports = TaskController;
