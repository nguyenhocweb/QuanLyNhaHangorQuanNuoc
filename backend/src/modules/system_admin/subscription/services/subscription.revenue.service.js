import { getRevenueRepo } from "../repositories/subscription.revenue.repo.js";

export const getRevenueService = async ({ month, year, page, limit, planName, status, search }) => {
    const { records, totalCount, totalRevenue } = await getRevenueRepo({ month, year, page, limit, planName, status, search });
    
    // Format the response
    const data = records.map(record => ({
        id: record.id,
        brandId: record.brandId,
        brandName: record.brand?.name || "Unknown Brand",
        brandLogo: record.brand?.logo || null,
        planName: record.plan?.name || "Unknown Plan",
        price: record.plan?.price || 0,
        startDate: record.startDate,
        endDate: record.endDate,
        status: record.status,
        createdAt: record.createdAt
    }));

    return {
        data,
        pagination: {
            totalItems: totalCount,
            totalPages: limit ? Math.ceil(totalCount / limit) : 1,
            currentPage: page || 1,
            itemsPerPage: limit || totalCount
        },
        totalRevenue
    };
};
