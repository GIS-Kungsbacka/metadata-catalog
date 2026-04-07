import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { managementPlanRequests } from "../api/management-plan-requests";
import type { ManagementPlan } from "../types/management-plan";

export const useManagementPlan = (): UseQueryResult<ManagementPlan[]> => {
  return useQuery({
    queryKey: ["managementplan"],
    queryFn: managementPlanRequests.getAll,
    retry: 3,
    retryDelay: 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
    staleTime: 0,
  });
};

export const useManagementPlanById = (
  gid: number
): UseQueryResult<ManagementPlan> => {
  return useQuery({
    queryKey: ["managementplan", gid],
    queryFn: () => managementPlanRequests.getById(gid),
  });
};
