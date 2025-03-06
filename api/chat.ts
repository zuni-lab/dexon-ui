import { apiClient } from './axios';

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
  async sendMessage(data: { message: string; threadId?: string; userAddress: string }) {
    return apiClient.post(
      '/api/chat/dex',
      {
        message: data.message,
        thread_id: data.threadId,
        user_address: data.userAddress
      },
      {
        responseType: 'text',
        headers: {
          Accept: 'text/event-stream'
        }
      }
    );
  },

  async listThreads(data: ListThreadsRequest): Promise<ListThreadsResponse> {
    const res = await apiClient.post<ListThreadsResponse>('/api/chat/dex/thread/list', data);
    return res.data;
  },

  async getThreadDetails(data: ThreadDetailsRequest): Promise<ThreadDetails> {
    const res = await apiClient.post<ThreadDetails>('/api/chat/dex/thread', data);
    return res.data;
  }
};
