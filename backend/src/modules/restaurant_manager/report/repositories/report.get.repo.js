import { prisma } from "../../../../databases/init.mongodb.js";

export const getRevenueReport = async (restaurantId, startDate, endDate) => {
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const restObjId = { $oid: restaurantId };

    // 1. TỔNG HỢP DOANH THU THEO NGÀY
    const dailyRevenueRaw = await prisma.$runCommandRaw({
        aggregate: "orders",
        pipeline: [
            {
                $match: {
                    status: "PAID",
                    restaurantId: restObjId,
                    createdAt: {
                        $gte: { $date: start.toISOString() },
                        $lte: { $date: end.toISOString() }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" }
                    },
                    revenue: { $sum: "$total_amount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ],
        cursor: {}
    });

    const dailyRevenueMap = {};
    if (dailyRevenueRaw && dailyRevenueRaw.cursor && dailyRevenueRaw.cursor.firstBatch) {
        dailyRevenueRaw.cursor.firstBatch.forEach(batch => {
            dailyRevenueMap[batch._id] = {
                date: batch._id,
                revenue: batch.revenue,
                orders: batch.orders,
                cost: 0
            };
        });
    }

    // 2. TỔNG HỢP CHI PHÍ
    const dailyCostRaw = await prisma.$runCommandRaw({
        aggregate: "purchase_orders",
        pipeline: [
            {
                $match: {
                    status: "COMPLETED",
                    restaurantId: restObjId,
                    createdAt: {
                        $gte: { $date: start.toISOString() },
                        $lte: { $date: end.toISOString() }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" }
                    },
                    cost: { $sum: "$totalAmount" }
                }
            }
        ],
        cursor: {}
    });

    if (dailyCostRaw && dailyCostRaw.cursor && dailyCostRaw.cursor.firstBatch) {
        dailyCostRaw.cursor.firstBatch.forEach(batch => {
            if (!dailyRevenueMap[batch._id]) {
                dailyRevenueMap[batch._id] = {
                    date: batch._id,
                    revenue: 0,
                    orders: 0,
                    cost: 0
                };
            }
            dailyRevenueMap[batch._id].cost += batch.cost;
        });
    }

    const dailyRevenue = Object.values(dailyRevenueMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Tính Tổng Overview
    let totalRevenue = 0;
    let totalCost = 0;
    let totalOrders = 0;
    
    dailyRevenue.forEach(d => {
        totalRevenue += d.revenue;
        totalCost += d.cost;
        totalOrders += d.orders;
    });

    // 3. Top Selling Items
    const topItemsRaw = await prisma.orderItem.groupBy({
        by: ['menuItemId', 'name'],
        where: { 
            order: {
                status: "PAID",
                createdAt: { gte: start, lte: end },
                restaurantId: restaurantId
            }
        },
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
    });

    const topSellingItems = topItemsRaw.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        totalQuantity: item._sum.quantity || 0,
        totalRevenue: item._sum.totalPrice || 0
    }));

    return {
        overview: {
            totalRevenue,
            totalCost,
            totalProfit: totalRevenue - totalCost,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
        },
        dailyRevenue,
        topSellingItems
    };
};
