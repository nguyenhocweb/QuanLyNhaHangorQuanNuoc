import { useQuery } from "@tanstack/react-query";
import { getTableMaintenanceService } from "../service/table_maintenance.get.service";

export const useGetTableMaintenance = (restaurantId?: string, params?: any) => {
    return useQuery({
        queryKey: ["table-maintenance", restaurantId, params],
        queryFn: () => getTableMaintenanceService(restaurantId!, params),
        enabled: !!restaurantId,
        staleTime: 60 * 1000
    });
};
