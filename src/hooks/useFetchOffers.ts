import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PaginatedOffersResponse, OfferType_ } from "@/types/Offers";

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

export function useFetchOfferById(id: string | undefined) {
  return useQuery<OfferType_>({
    queryKey: ["offer", id],
    queryFn: async () => {
      const response = await api.get(`/offers/${id}`);
      return response.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}
