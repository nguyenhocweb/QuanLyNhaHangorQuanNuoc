import { getMyInvoicesRepo } from "../invoice.repository/invoice.get.repo.js";

export const getMyInvoicesService = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { total, invoices } = await getMyInvoicesRepo(userId, { skip, take: limit });

    return {
        data: invoices,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
