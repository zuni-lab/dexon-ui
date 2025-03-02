import { apiClient } from './axios';

export const healthService = {
  async health() {
    return apiClient.get<string>('/health');
  }
};
