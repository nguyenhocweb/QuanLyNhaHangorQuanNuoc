import { getTableMaintenanceRepo } from "../repositories/table_maintenance.get.repo.js";

export const getTableMaintenanceService = async (restaurantId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    const { items, total } = await getTableMaintenanceRepo(restaurantId, {
        skip,
        take: limit,
        status: query.status,
        startDate: query.startDate,
        endDate: query.endDate
    });

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
