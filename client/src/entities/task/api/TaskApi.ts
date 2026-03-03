import { axiosInstance } from '../../../shared/lib/axiosInstance';
import type {
  CreateTaskRequest,
  Task,
  TaskListResponse,
  TaskResponse,
  UpdateTaskRequest,
} from '../model';
import type { ApiResponse } from '../../user/model';

export default class TaskApi {
  static async getTasks(): Promise<TaskListResponse> {
    try {
      const response = await axiosInstance.get<ApiResponse<Task[]>>('/tasks');
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: 'Ошибка при получении задач',
        data: [],
        error: 'Ошибка при получении задач',
      };
    }
  }

  static async getTask(id: number): Promise<TaskResponse> {
    try {
      const response = await axiosInstance.get<ApiResponse<Task>>(
        `/tasks/${id}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: 'Ошибка при получении задачи',
        data: {} as Task,
        error: 'Ошибка при получении задачи',
      };
    }
  }

  static async createTask(body: CreateTaskRequest): Promise<TaskResponse> {
    try {
      const response = await axiosInstance.post<ApiResponse<Task>>(
        '/tasks',
        body,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: 'Ошибка при создании задачи',
        data: {} as Task,
        error: 'Ошибка при создании задачи',
      };
    }
  }

  static async updateTask(
    id: number,
    body: UpdateTaskRequest,
  ): Promise<TaskResponse> {
    try {
      const response = await axiosInstance.put<ApiResponse<Task>>(
        `/tasks/${id}`,
        body,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: 'Ошибка при обновлении задачи',
        data: {} as Task,
        error: 'Ошибка при обновлении задачи',
      };
    }
  }

  static async deleteTask(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/tasks/${id}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: 'Ошибка при удалении задачи',
        data: null,
        error: 'Ошибка при удалении задачи',
      };
    }
  }
}

