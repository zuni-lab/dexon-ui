import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for SSE handling
apiClient.interceptors.response.use(
  (response) => {
    if (response.headers['content-type']?.includes('text/event-stream')) {
      return {
        ...response,
        data: response.data, // Keep raw response for SSE handling
        isSSE: true
      };
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
