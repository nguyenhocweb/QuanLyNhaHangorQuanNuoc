import { useQuery } from "@tanstack/react-query";
import { getSuppliersService } from "../services/supplier.get.service";

export const useGetSuppliers = (brandId: string | undefined, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["brand-suppliers", brandId, page, limit],
    queryFn: async () => { const { data } = await getSuppliersService(brandId!, page, limit); return data; },
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};
