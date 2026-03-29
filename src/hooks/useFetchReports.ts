import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PaginatedReportsResponse } from "@/types/Reports";

export async function fetchReports(filters = {}): Promise<PaginatedReportsResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/reports?${params.toString()}`);
  return response.data;
}

export function useFetchReports(filters = {}) {
  return useQuery<PaginatedReportsResponse>({
    queryKey: ["reports", filters],
    queryFn: () => fetchReports(filters),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  });
}
