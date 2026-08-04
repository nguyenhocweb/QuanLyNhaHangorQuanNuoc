import axiosClient from "@/src/core/api/axios-instance";
import { ITableMaintenanceSchedule } from "../type/table_maintenance.type";

export const getTableMaintenanceService = async (restaurantId: string, params?: any): Promise<{ message: string; metadata: { items: ITableMaintenanceSchedule[]; pagination: any } }> => {
    return await axiosClient.get("/restaurant-manager/table-maintenance", {
        params: { restaurantId, ...params }
    });
};
