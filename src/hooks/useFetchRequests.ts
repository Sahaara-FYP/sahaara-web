import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  PaginatedResponse,
  RequestFilters,
  RequestType,
} from "@/types/Requests";
import { useState } from "react";

export async function fetchRequests(
  filters: RequestFilters = {}
): Promise<PaginatedResponse<RequestType>> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/requests?${params.toString()}`);
  return response.data;
}

export function useFetchRequests(filters: RequestFilters = {}) {
  return useQuery<PaginatedResponse<RequestType>>({
    queryKey: ["requests", filters],
    queryFn: () => fetchRequests(filters),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 30,
  });
}
