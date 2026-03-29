import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PaginatedOffersResponse } from "@/types/Offers";

export async function fetchOffers(filters = {}): Promise<PaginatedOffersResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/offers?${params.toString()}`);
  return response.data;
}

export function useFetchOffers(filters = {}) {
  return useQuery<PaginatedOffersResponse>({
    queryKey: ["offers", filters],
    queryFn: () => fetchOffers(filters),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 30,
  });
}
