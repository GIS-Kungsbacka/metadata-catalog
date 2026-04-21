import { api } from "./axiosConfig";
import type { MetadataColumnDescription } from "../types/metadata-columndescription";

const BASE = "/metadatacolumndescription";

export const metadataColumnDescRequests = {
  getAll: async (): Promise<MetadataColumnDescription[]> => {
    const response = await api.get<MetadataColumnDescription[]>(BASE);
    return response.data;
  },

  getById: async (gid: number): Promise<MetadataColumnDescription> => {
    const response = await api.get<MetadataColumnDescription>(`${BASE}/${gid}`);
    return response.data;
  },
};
