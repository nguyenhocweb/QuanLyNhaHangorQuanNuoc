import { getMyReservationsRepo } from "../reservation.repository/reservation.get.repo.js";

export const getReservationHistoryService = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {};
    if (query.status) {
        filters.status = query.status;
    }

    const { total, reservations } = await getMyReservationsRepo(userId, filters, { skip, take: limit });

    return {
        data: reservations,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
