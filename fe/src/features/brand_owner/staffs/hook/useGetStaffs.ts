import { useQuery } from "@tanstack/react-query";
import { getStaffsService } from "../service/staff.get.service";

interface IUseGetStaffsProps {
  brandId: string;
  page: number;
  limit: number;
  search?: string;
  restaurantId?: string;
}

export const useGetStaffs = ({ brandId, page, limit, search, restaurantId }: IUseGetStaffsProps) => {
  return useQuery({
    queryKey: ["staffs", brandId, { page, limit, search, restaurantId }],
    queryFn: () => getStaffsService(brandId, { page, limit, search, restaurantId }),
    enabled: !!brandId,
    staleTime: 60 * 1000,
  });
};
