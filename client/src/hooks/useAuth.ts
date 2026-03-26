import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useAuth() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    retry: false,
  });

  return {
    user: data,
    isLoading,
    error,
  };
}

export function getInitials(username: string): string {
  if (!username) return "";

  const namePart = username.split("\\").pop() || "";
  if (!namePart) return "";

  const cleaned = namePart.replace(/\d+$/, "");

  const parts = cleaned.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return ((parts[0][0] || "") + (parts[1][0] || "")).toUpperCase();
  }

  if (cleaned.length >= 4) {
    return (cleaned[0] + cleaned[3]).toUpperCase();
  }

  if (cleaned.length >= 2) {
    return (cleaned[0] + cleaned[cleaned.length - 1]).toUpperCase();
  }

  return cleaned[0]?.toUpperCase() || "";
}
