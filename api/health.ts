import { apiClient } from "./axios";

export const healthService = {
  health() {
    return apiClient.get<string>("/health");
  },
};
