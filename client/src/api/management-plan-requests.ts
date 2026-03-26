import { api } from "./axiosConfig";
import type { ManagementPlan } from "../types/management-plan";

const BASE = "/managementplan";

export const managementPlanRequests = {
  getAll: async (): Promise<ManagementPlan[]> => {
    const response = await api.get<ManagementPlan[]>(BASE);
    return response.data;
  },

  getById: async (gid: number): Promise<ManagementPlan> => {
    const response = await api.get<ManagementPlan>(`${BASE}/${gid}`);
    return response.data;
  },
};
