import { ProjectENV } from "@env";
import { apiClient } from "./axios";

interface ListThreadsRequest {
  user_address: string;
  offset: number;
  limit: number;
}

interface ListThreadsResponse {
  data: Thread[];
  count: number;
}

interface ThreadDetailsRequest {
  thread_id: string;
  user_address: string;
}

export const chatService = {
  async sendMessage(data: {
    message: string;
    threadId?: string;
    userAddress: string;
  }) {
    try {
      const response = await fetch(
        `${ProjectENV.NEXT_PUBLIC_API_URL}/api/chat/dex`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            message: data.message,
            thread_id: data.threadId,
            user_address: data.userAddress,
          }),
        },
      );

      if (!response.body) {
        throw new Error("No response body from server");
      }

      return response.body;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  async listThreads(data: ListThreadsRequest): Promise<ListThreadsResponse> {
    const res = await apiClient.post<ListThreadsResponse>(
      "/api/chat/dex/thread/list",
      data,
    );
    return res.data;
  },

  async getThreadDetails(data: ThreadDetailsRequest): Promise<ThreadDetails> {
    const res = await apiClient.post<ThreadDetails>(
      "/api/chat/dex/thread",
      data,
    );
    return res.data;
  },
};
