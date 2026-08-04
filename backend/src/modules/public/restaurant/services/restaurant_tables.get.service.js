import { getAvailableTablesRepo } from "../repositories/restaurant_tables.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getAvailableTablesService = async (restaurantId, queryParams) => {
    const tables = await getAvailableTablesRepo(restaurantId, queryParams);
    
    if (!tables) {
        throw new NotFoundError("Không tìm thấy bàn phù hợp");
    }

    return tables;
};
