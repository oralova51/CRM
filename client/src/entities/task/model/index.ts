import type { ApiResponse } from '../../user/model';

export type Task = {
  id: number;
  title: string;
  text: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskListResponse = ApiResponse<Task[]>;

export type TaskResponse = ApiResponse<Task>;

export type CreateTaskRequest = {
  title: string;
  text: string;
};

export type UpdateTaskRequest = Partial<CreateTaskRequest>;

