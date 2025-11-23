import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const fetchAnalytics = async () => {
  const { data } = await api.get("/analytics/all");
  return data;
};

export const useAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchAnalytics,
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
