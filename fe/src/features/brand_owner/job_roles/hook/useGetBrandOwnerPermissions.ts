import { useQuery } from "@tanstack/react-query";
import { getBrandOwnerPermissionsService } from "../service/brand_owner_permission.get.service";

export const useGetBrandOwnerPermissions = (brandId: string) => {
  return useQuery({
    queryKey: ["brand_permissions", brandId],
    queryFn: () => getBrandOwnerPermissionsService(brandId),
    staleTime: 60 * 1000 * 5, // 5 phút
    enabled: !!brandId,
  });
};
