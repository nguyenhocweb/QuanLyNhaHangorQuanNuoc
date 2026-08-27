import { prisma } from "../../../../databases/init.mongodb.js";

export const getRevenueReport = async (brandId, startDate, endDate) => {
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    // 1. Lấy tất cả nhà hàng của Brand
    const restaurants = await prisma.restaurant.findMany({
        where: { brandId },
        select: { id: true, name: true }
    });
    const restaurantIds = restaurants.map(r => r.id);
    const restaurantIdsObjId = restaurantIds.map(id => ({ $oid: id }));
    
    // Map tên nhà hàng
    const restaurantMap = restaurants.reduce((acc, r) => {
        acc[r.id] = r.name;
        return acc;
    }, {});

    // 2. TỔNG HỢP DOANH THU THEO NGÀY (MONGODB PIPELINE VỚI TIMEZONE GMT+7)
    // Để fix lỗi timezone leak, bắt buộc dùng pipeline MongoDB
    const dailyRevenueRaw = await prisma.$runCommandRaw({
        aggregate: "orders",
        pipeline: [
            {
                $match: {
                    status: "PAID",
                    createdAt: {
                        $gte: { $date: start.toISOString() },
                        $lte: { $date: end.toISOString() }
                    },
                    $or: [
                        { restaurantId: { $in: restaurantIdsObjId } },
                        { "reservation.restaurantId": { $in: restaurantIdsObjId } } // if reservation is embedded, actually it's a ref.
                        // For Prisma MongoDB, we can just match restaurantId. To keep it simple, we assume restaurantId is populated in orders.
                    ]
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

    // 3. TỔNG HỢP CHI PHÍ (TỪ PURCHASE ORDERS) THEO NGÀY
    const dailyCostRaw = await prisma.$runCommandRaw({
        aggregate: "purchase_orders",
        pipeline: [
            {
                $match: {
                    status: "COMPLETED",
                    restaurantId: { $in: restaurantIdsObjId },
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

    // 4. DOANH THU & CHI PHÍ THEO TỪNG CHI NHÁNH
    const branchRevenueRaw = await prisma.$runCommandRaw({
        aggregate: "orders",
        pipeline: [
            {
                $match: {
                    status: "PAID",
                    restaurantId: { $in: restaurantIdsObjId },
                    createdAt: {
                        $gte: { $date: start.toISOString() },
                        $lte: { $date: end.toISOString() }
                    }
                }
            },
            {
                $group: {
                    _id: "$restaurantId",
                    revenue: { $sum: "$total_amount" },
                    orders: { $sum: 1 }
                }
            }
        ],
        cursor: {}
    });

    const branchCostRaw = await prisma.$runCommandRaw({
        aggregate: "purchase_orders",
        pipeline: [
            {
                $match: {
                    status: "COMPLETED",
                    restaurantId: { $in: restaurantIdsObjId },
                    createdAt: {
                        $gte: { $date: start.toISOString() },
                        $lte: { $date: end.toISOString() }
                    }
                }
            },
            {
                $group: {
                    _id: "$restaurantId",
                    cost: { $sum: "$totalAmount" }
                }
            }
        ],
        cursor: {}
    });

    const revenueByBranchMap = {};
    // Khởi tạo map cho tất cả chi nhánh
    restaurantIds.forEach(id => {
        revenueByBranchMap[id] = {
            restaurantId: id,
            restaurantName: restaurantMap[id] || "Không xác định",
            revenue: 0,
            orders: 0,
            cost: 0,
            profit: 0
        };
    });

    if (branchRevenueRaw?.cursor?.firstBatch) {
        branchRevenueRaw.cursor.firstBatch.forEach(batch => {
            const id = batch._id.$oid;
            if (revenueByBranchMap[id]) {
                revenueByBranchMap[id].revenue = batch.revenue;
                revenueByBranchMap[id].orders = batch.orders;
            }
        });
    }

    if (branchCostRaw?.cursor?.firstBatch) {
        branchCostRaw.cursor.firstBatch.forEach(batch => {
            const id = batch._id.$oid;
            if (revenueByBranchMap[id]) {
                revenueByBranchMap[id].cost = batch.cost;
            }
        });
    }

    // Tính Profit
    Object.values(revenueByBranchMap).forEach(b => {
        b.profit = b.revenue - b.cost;
    });

    const revenueByBranch = Object.values(revenueByBranchMap).sort((a, b) => b.revenue - a.revenue);

    // Tính Overview Tổng
    let totalRevenue = 0;
    let totalCost = 0;
    let totalOrders = 0;
    
    dailyRevenue.forEach(d => {
        totalRevenue += d.revenue;
        totalCost += d.cost;
        totalOrders += d.orders;
    });

    // 5. Top Selling Items (sử dụng Prisma groupBy cho đơn giản vì không dính tới timezone date)
    const orderWhere = {
        status: "PAID",
        createdAt: { gte: start, lte: end },
        restaurantId: { in: restaurantIds }
    };
    
    const topItemsRaw = await prisma.orderItem.groupBy({
        by: ['menuItemId', 'name'],
        where: { order: { is: orderWhere } },
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
        revenueByBranch,
        topSellingItems
    };
};
