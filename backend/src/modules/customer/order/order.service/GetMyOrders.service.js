import { getMyOrdersRepo } from "../order.repository/order.get.repo.js";

export const getMyOrdersService = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {};
    if (query.status) {
        filters.status = query.status;
    }

    const { total, orders } = await getMyOrdersRepo(userId, filters, { skip, take: limit });

    return {
        data: orders,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
