import axiosClient from "@/src/core/api/axios-instance";
import { IUpdateTableMaintenancePayload, ITableMaintenanceSchedule } from "../type/table_maintenance.type";

export const updateTableMaintenanceService = async (id: string, payload: IUpdateTableMaintenancePayload): Promise<{ message: string; metadata: ITableMaintenanceSchedule }> => {
    return await axiosClient.put(`/restaurant-manager/table-maintenance/${id}`, payload);
};
