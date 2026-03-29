import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PaginatedVerificationsResponse } from "@/types/Verifications";

export async function fetchVerifications(filters = {}): Promise<PaginatedVerificationsResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/users/admin/verifications?${params.toString()}`);
  return response.data;
}

export function useFetchVerifications(filters = {}) {
  return useQuery<PaginatedVerificationsResponse>({
    queryKey: ["verifications", filters],
    queryFn: () => fetchVerifications(filters),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });
}
