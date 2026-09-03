import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { metadataRequests } from "../api/metadata-requests";
import type { Metadata } from "../types/metadata";
import { metadataColumnDescRequests } from "../api/metadata-columndescription-requests";
import type { MetadataColumnDescription } from "../types/metadata-columndescription";
import { metadataTechDescriptionRequests } from "../api/metadata-techdescription-requests";
import type { MetadataTechDescription } from "../types/metadata-techdescription";

type Options = {
  enabled?: boolean;
};

export const useMetadata = (options?: Options): UseQueryResult<Metadata[]> => {
  return useQuery({
    queryKey: ["metadata"],
    queryFn: metadataRequests.getAll,
    enabled: options?.enabled ?? true,
    retry: 3,
    retryDelay: 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
    staleTime: 0,
  });
};

export const useMetadataById = (
  gid: number,
  options?: Options
): UseQueryResult<Metadata> => {
  return useQuery({
    queryKey: ["metadata", gid],
    queryFn: () => metadataRequests.getById(gid),
    enabled: options?.enabled ?? true,
  });
};

export const useMetadataColumnDescription = (
  options?: Options
): UseQueryResult<MetadataColumnDescription[]> => {
  return useQuery({
    queryKey: ["metadataColumnDescription"],
    queryFn: metadataColumnDescRequests.getAll,
    enabled: options?.enabled ?? true,
  });
};

export const useMetadataTechDescription = (
  options?: Options
): UseQueryResult<MetadataTechDescription[]> => {
  return useQuery({
    queryKey: ["metadataTechDescription"],
    queryFn: metadataTechDescriptionRequests.getAll,
    enabled: options?.enabled ?? true,
  });
};

export const useMetadataTechDescriptionById = (
  gid: number,
  options?: Options
): UseQueryResult<MetadataTechDescription> => {
  return useQuery({
    queryKey: ["metadataTechDescription", gid],
    queryFn: () => metadataTechDescriptionRequests.getById(gid),
    enabled: options?.enabled ?? true,
  });
};
