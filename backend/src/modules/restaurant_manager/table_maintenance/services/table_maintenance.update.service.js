import { updateTableMaintenanceRepo } from "../repositories/table_maintenance.update.repo.js";
import { emitTableUpdate } from "../../../../core/utils/socket.js";


export const updateTableMaintenanceService = async (id, payload) => {
    const data = { ...payload };
    if (data.start_time) data.start_time = new Date(data.start_time);
    if (data.end_time) data.end_time = new Date(data.end_time);

    if (data.status === "COMPLETED" && (!data.end_time || new Date(data.end_time) > new Date())) {
        data.end_time = new Date();
    }

    const result = await updateTableMaintenanceRepo(id, data);

    if (result?.restaurantId) {
        emitTableUpdate(result.restaurantId);
    }

    return result;
};

