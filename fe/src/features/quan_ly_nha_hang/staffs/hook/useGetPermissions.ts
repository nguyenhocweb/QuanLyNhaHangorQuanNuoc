import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/src/core/api/axios-instance";

export const useGetPermissions = (brandId: string | undefined) => {
  return useQuery({
    queryKey: ["permissions", brandId],
    queryFn: async () => {
      if (!brandId) return null;
      const res = await axiosClient.get(`/brand-owner/${brandId}/permission`);
      return res.data.metadata;
    },
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};
