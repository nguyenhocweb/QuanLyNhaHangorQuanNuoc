import { prisma } from "../../../../databases/init.mongodb.js";

export const getRevenueRepo = async ({ month, year, page, limit, planName, status, search }) => {
    const whereClause = {};

    if (status) {
        whereClause.status = status;
    } else {
        whereClause.status = {
            in: ['ACTIVE', 'EXPIRED']
        };
    }

    if (planName) {
        whereClause.plan = {
            name: planName
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
            // Lọc theo tháng cụ thể của năm
            // Month in JS Date is 0-indexed (0 = Jan), but we receive 1-indexed (1 = Jan)
            startDate = new Date(year, month - 1, 1);
            // new Date(year, month, 0) gives the last day of the previous month (which is the requested month)
            endDate = new Date(year, month, 0, 23, 59, 59, 999);
        } else {
            // Lọc cả năm
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        }
        
        whereClause.startDate = {
            gte: startDate,
            lte: endDate
        };
    }

    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit ? limit : undefined;

    const [records, totalCount, allFilteredRecords] = await Promise.all([
        prisma.brandSubscription.findMany({
            where: whereClause,
            include: {
                brand: {
                    select: {
                        name: true,
                        logo: true
                    }
                },
                plan: {
                    select: {
                        name: true,
                        price: true
                    }
                }
            },
            orderBy: {
                startDate: 'desc'
            },
            skip,
            take
        }),
        prisma.brandSubscription.count({
            where: whereClause
        }),
        prisma.brandSubscription.findMany({
            where: whereClause,
            include: {
                plan: {
                    select: { price: true }
                }
            }
        })
    ]);

    const totalRevenue = allFilteredRecords.reduce((sum, record) => sum + (record.plan?.price || 0), 0);

    return { records, totalCount, totalRevenue };
};
