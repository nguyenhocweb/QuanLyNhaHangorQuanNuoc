import { useQuery } from "@tanstack/react-query";
import { getStaffsService, IGetStaffsParams } from "../service/staff.get.service";
import useRealtimeUpdates from "@/src/core/hooks/useRealtimeUpdates";

export const useGetStaffs = (params: IGetStaffsParams) => {
  useRealtimeUpdates(params.restaurantId);

  return useQuery({
    queryKey: ["restaurant-staffs", params.restaurantId, params.page, params.limit, params.search, params.salary_type],
    queryFn: () => getStaffsService(params),
    staleTime: 60 * 1000,
    enabled: !!params.restaurantId,
  });
};
