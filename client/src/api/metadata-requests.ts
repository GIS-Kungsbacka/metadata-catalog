import { api } from "./axiosConfig";
import type { Metadata } from "../types/metadata";

const BASE = "/metadata";

export const metadataRequests = {
  getAll: async (): Promise<Metadata[]> => {
    const response = await api.get<Metadata[]>(BASE);
    return response.data;
  },

  getById: async (gid: number): Promise<Metadata> => {
    const response = await api.get<Metadata>(`${BASE}/${gid}`);
    return response.data;
  },
};
