import { ProjectENV } from "@env";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: ProjectENV.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
