import { axiosInstance } from "../../../shared/lib/axiosInstance";

import type { RagQueryResponse, ServerResponseType } from "../model";

export default class AiApi {
    static async createChat(body: { question: string }): Promise<RagQueryResponse> {
        const response = await axiosInstance.post<RagQueryResponse>("/rag/query", body);
        return response.data;
    }

    static async getChatHistory(): Promise<ServerResponseType<{ content: string; role: string }[]>> {
        const response = await axiosInstance.get<ServerResponseType<{ content: string; role: string }[]>>("/ai/history");
        return response.data;
    }
}