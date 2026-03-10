import { axiosInstance } from "../../../shared/lib/axiosInstance";

import type { AiMessageResponse } from "../model";

export default class AiApi {
  static async createChat(body: { message: string }): Promise<AiMessageResponse> {
    const response = await axiosInstance.post<AiMessageResponse>("/ai/chat", body);
    return response.data;
  }

  static async getChatHistory(): Promise<AiMessageResponse[]> {
    const response = await axiosInstance.get<AiMessageResponse[]>("/ai/history");
    return response.data;
  }
}