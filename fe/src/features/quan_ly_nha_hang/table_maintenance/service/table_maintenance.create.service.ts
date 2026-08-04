import axiosClient from "@/src/core/api/axios-instance";
import { ICreateTableMaintenancePayload, ITableMaintenanceSchedule } from "../type/table_maintenance.type";

export const createTableMaintenanceService = async (payload: ICreateTableMaintenancePayload): Promise<{ message: string; metadata: ITableMaintenanceSchedule }> => {
    return await axiosClient.post("/restaurant-manager/table-maintenance", payload);
};
