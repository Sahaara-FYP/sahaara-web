// dont know schema yet so will do later
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PaginatedResponse } from "@/types/Requests";
import type { AlertType } from "@/types/Alerts";

export async function fetchAlerts(
  filters = {}
): Promise<PaginatedResponse<AlertType>> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/alerts?${params.toString()}`);
  return response.data;
}

export function useFetchAlerts(filters = {}) {
  return useQuery<PaginatedResponse<AlertType>>({
    queryKey: ["alerts", filters],
    queryFn: () => fetchAlerts(filters),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 30,
  });
}
