import { api } from "./axiosConfig";
import type { MetadataTechDescription } from "../types/metadata-techdescription";

const BASE = "/metadatatechdescription";

export const metadataTechDescriptionRequests = {
  getAll: async (): Promise<MetadataTechDescription[]> => {
    const response = await api.get<MetadataTechDescription[]>(BASE);
    return response.data;
  },

  getById: async (gid: number): Promise<MetadataTechDescription> => {
    const response = await api.get<MetadataTechDescription>(`${BASE}/${gid}`);
    return response.data;
  },
};
