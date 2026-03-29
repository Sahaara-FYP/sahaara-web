import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { UsersResponse } from "@/types/AdminUsers";

// Type for the filter state maintained in the Users page
type UsersFilterParams = {
  search?: string;
  role?: string;
  isActive?: string;
  isVerified?: string;
  limit?: number;
  offset?: number;
};

// Hook to fetch paginated/filtered users
export const useFetchUsers = (filters: UsersFilterParams) => {
  return useQuery<UsersResponse>({
    queryKey: ["admin_users", filters],
    queryFn: async () => {
      // Clean up filters to remove empty strings before sending
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "" && v !== undefined)
      );

      const params = new URLSearchParams(cleanedFilters as any);
      const res = await api.get(`/users/admin/users?${params.toString()}`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
