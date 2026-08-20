import { getRevenueRepo } from "../repositories/subscription.revenue.repo.js";

export const getRevenueService = async ({ month, year, page, limit, planName, status, search }) => {
    const { records, totalCount, totalRevenue } = await getRevenueRepo({ month, year, page, limit, planName, status, search });
    
    // Format the response
    const data = records.map(record => ({
        id: record.id,
        invoiceNumber: record.invoiceNumber,
        brandId: record.brandId,
        brandName: record.brand?.name || "Unknown Brand",
        brandLogo: record.brand?.logo || null,
        planName: record.subscription?.plan?.name || "Unknown Plan",
        price: record.total || 0,
        startDate: record.subscription?.currentPeriodStart,
        endDate: record.subscription?.currentPeriodEnd,
        status: record.status,
        paidAt: record.paidAt,
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
