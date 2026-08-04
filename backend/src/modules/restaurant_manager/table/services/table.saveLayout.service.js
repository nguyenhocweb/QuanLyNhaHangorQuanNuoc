import { saveTableLayoutRepo } from "../repositories/table.saveLayout.repo.js";
import { emitTableUpdate } from "../../../../core/utils/socket.js";

export const saveTableLayoutService = async (body) => {
    const { tables } = body;
    if (!tables || tables.length === 0) return [];
    
    // We trust the input pos_x, pos_y from frontend since it's just layout data
    const results = await saveTableLayoutRepo(tables);
    if (results.length > 0 && results[0].restaurantId) {
        emitTableUpdate(results[0].restaurantId);
    }
    return results;
};
