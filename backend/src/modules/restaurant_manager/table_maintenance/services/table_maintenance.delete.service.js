import { deleteTableMaintenanceRepo } from "../repositories/table_maintenance.delete.repo.js";
import { emitTableUpdate } from "../../../../core/utils/socket.js";

export const deleteTableMaintenanceService = async (id) => {
    const result = await deleteTableMaintenanceRepo(id);
    if (result?.restaurantId) {
        emitTableUpdate(result.restaurantId);
    }
    return result;
};

