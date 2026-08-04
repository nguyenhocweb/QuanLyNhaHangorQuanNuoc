import { prisma } from "../../../../databases/init.mongodb.js";

export const getRevenueReport = async (brandId, startDate, endDate) => {
    // Determine the date range
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    // 1. Get all restaurants belonging to the brand
    const restaurants = await prisma.restaurant.findMany({
        where: { brandId },
        select: { id: true, name: true }
    });
    const restaurantIds = restaurants.map(r => r.id);
    const restaurantMap = restaurants.reduce((acc, r) => {
        acc[r.id] = r.name;
        return acc;
    }, {});

    // Common filter for Orders belonging to this brand within the date range and PAID
    const orderWhere = {
        status: "PAID",
        createdAt: {
            gte: start,
            lte: end
        },
        OR: [
            { reservation: { restaurantId: { in: restaurantIds } } },
            { restaurantId: { in: restaurantIds } }
        ]
    };

    // 2. Overview (Total Revenue, Total Orders)
    const overviewRaw = await prisma.order.aggregate({
        where: orderWhere,
        _sum: {
            total_amount: true
        },
        _count: {
            id: true
        }
    });

    const totalRevenue = overviewRaw._sum.total_amount || 0;
    const totalOrders = overviewRaw._count.id || 0;

    // 3. Revenue by Branch
    // We fetch all matching orders and aggregate in memory.
    const orders = await prisma.order.findMany({
        where: orderWhere,
        select: {
            total_amount: true,
            createdAt: true,
            restaurantId: true,
            reservation: {
                select: {
                    restaurantId: true
                }
            }
        }
    });

    const revenueByBranchMap = {};
    const dailyRevenueMap = {};

    orders.forEach(order => {
        // Branch aggregation
        const resId = order.restaurantId || order.reservation?.restaurantId;
        const resName = resId ? restaurantMap[resId] : "Chi nhánh khác";
        const finalResId = resId || "unknown";
        
        if (!revenueByBranchMap[finalResId]) {
            revenueByBranchMap[finalResId] = {
                restaurantId: finalResId,
                restaurantName: resName,
                revenue: 0,
                orders: 0
            };
        }
        revenueByBranchMap[finalResId].revenue += order.total_amount;
        revenueByBranchMap[finalResId].orders += 1;

        // Daily aggregation
        const dateString = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
        if (!dailyRevenueMap[dateString]) {
            dailyRevenueMap[dateString] = {
                date: dateString,
                revenue: 0,
                orders: 0
            };
        }
        dailyRevenueMap[dateString].revenue += order.total_amount;
        dailyRevenueMap[dateString].orders += 1;
    });

    const revenueByBranch = Object.values(revenueByBranchMap).sort((a, b) => b.revenue - a.revenue);
    const dailyRevenue = Object.values(dailyRevenueMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    // 4. Top Selling Items
    const topItemsRaw = await prisma.orderItem.groupBy({
        by: ['menuItemId', 'name'],
        where: {
            order: orderWhere
        },
        _sum: {
            quantity: true,
            totalPrice: true
        },
        orderBy: {
            _sum: {
                quantity: 'desc'
            }
        },
        take: 5
    });

    const topSellingItems = topItemsRaw.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        totalQuantity: item._sum.quantity,
        totalRevenue: item._sum.totalPrice
    }));

    return {
        overview: {
            totalRevenue,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
        },
        dailyRevenue,
        revenueByBranch,
        topSellingItems
    };
};
