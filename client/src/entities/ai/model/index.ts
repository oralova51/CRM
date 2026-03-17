export type ServerResponseType<T> = {
    statusCode: number;
    message: string;
    data: T;
    error: string | null;
};

export type AiMessage = {
    content: string;
};

export type AiMessageResponse = ServerResponseType<AiMessage>;

export type RagQueryResponse = {
    message: string;
    answer: string;
    context?: string[];
};

  