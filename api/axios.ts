import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.headers['content-type']?.includes('text/event-stream')) {
      return {
        ...response,
        data: response.data,
        isSSE: true
      };
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
