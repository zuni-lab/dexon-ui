import { apiClient } from './axios';

interface ChatRequest {
  message: string;
  threadId?: string;
}

export const chatService = {
  async sendMessage(data: ChatRequest) {
    return apiClient.post('/api/chat/dex', data, {
      responseType: 'text',
      headers: {
        Accept: 'text/event-stream'
      }
    });
  }
};
