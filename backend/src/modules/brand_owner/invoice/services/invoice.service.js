import { prisma } from "../../../../databases/init.mongodb.js";

class InvoiceService {
    async getInvoices(brandId, queryParams) {
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const status = queryParams.status; // DRAFT, OPEN, PAID...

        const skip = (page - 1) * limit;

        const whereClause = {
            brandId
        };

        if (status) {
            whereClause.status = status;
        }

        const [invoices, totalCount] = await Promise.all([
            prisma.invoice.findMany({
                where: whereClause,
                include: {
                    subscription: {
                        include: {
                            plan: {
                                select: {
                                    name: true,
                                    billingCycle: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    id: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.invoice.count({
                where: whereClause
            })
        ]);

        return {
            data: invoices,
            pagination: {
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        };
    }
}

export const invoiceService = new InvoiceService();
