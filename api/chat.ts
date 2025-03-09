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
  async sendMessage(
    data: { message: string; threadId?: string; userAddress: string },
    retries = 3, // Max retries
  ): Promise<ReadableStream> {
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

    if (!response.ok) {
      const errorText = await response.text(); // Get error message

      // Handle 503 (Service Unavailable)
      if (response.status === 503 && retries > 0) {
        const retryAfter =
          Number.parseInt(response.headers.get("Retry-After") || "1") * 1000; // Convert to ms
        console.warn(`503 received, retrying in ${retryAfter}ms...`);

        await new Promise((resolve) => setTimeout(resolve, retryAfter)); // Wait before retrying
        return chatService.sendMessage(data, retries - 1); // Retry
      }

      throw new Error(errorText);
    }

    if (!response.body) {
      throw new Error("No response body from server");
    }

    return response.body;
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
