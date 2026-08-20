import { prisma } from "../../../../databases/init.mongodb.js";

export const getRevenueRepo = async ({ month, year, page, limit, planName, status, search }) => {
    const whereClause = {
        status: 'PAID'
    };

    if (planName) {
        whereClause.subscription = {
            plan: {
                name: planName
            }
        };
    }

    if (search) {
        whereClause.OR = [
            {
                brand: {
                    name: { contains: search, mode: 'insensitive' }
                }
            }
        ];
        
        if (/^[0-9a-fA-F]{24}$/.test(search)) {
            whereClause.OR.push({
                brandId: search
            });
        }
    }

    if (year) {
        let startDate, endDate;
        if (month) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0, 23, 59, 59, 999);
        } else {
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        }
        
        whereClause.paidAt = {
            gte: startDate,
            lte: endDate
        };
    }

    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit ? limit : undefined;

    const [records, totalCount, allFilteredRecords] = await Promise.all([
        prisma.invoice.findMany({
            where: whereClause,
            include: {
                brand: {
                    select: {
                        name: true,
                        logo: true
                    }
                },
                subscription: {
                    include: {
                        plan: {
                            select: {
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                paidAt: 'desc'
            },
            skip,
            take
        }),
        prisma.invoice.count({
            where: whereClause
        }),
        prisma.invoice.findMany({
            where: whereClause,
            select: { total: true }
        })
    ]);

    const totalRevenue = allFilteredRecords.reduce((sum, record) => sum + (record.total || 0), 0);

    return { records, totalCount, totalRevenue };
};
