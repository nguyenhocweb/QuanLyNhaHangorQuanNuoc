import { prisma } from "../../../../databases/init.mongodb.js";

export const getDashboardStatsRepo = async () => {
    const totalBrands = await prisma.brand.count();
    const totalRestaurants = await prisma.restaurant.count();
    const totalUsers = await prisma.user.count();

    const recentRequests = await prisma.upgradeRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, email: true, avatar: true } }
        }
    });

    // Lấy 6 tháng gần nhất cho biểu đồ
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthString = `Tháng ${d.getMonth() + 1}`;
        months.push({
            month: monthString,
            name: monthString,
            brands: 0,
            restaurants: 0,
            users: 0,
            revenue: 0,
            year: d.getFullYear(),
            monthNum: d.getMonth()
        });
    }

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [brandsData, restaurantsData, usersData] = await Promise.all([
        prisma.brand.findMany({ where: { createdAt: { gte: sixMonthsAgo } }, select: { createdAt: true } }),
        prisma.restaurant.findMany({ where: { createdAt: { gte: sixMonthsAgo } }, select: { createdAt: true } }),
        prisma.user.findMany({ where: { createdAt: { gte: sixMonthsAgo } }, select: { createdAt: true } })
    ]);

    brandsData.forEach(b => {
        const m = b.createdAt.getMonth();
        const y = b.createdAt.getFullYear();
        const target = months.find(x => x.monthNum === m && x.year === y);
        if (target) target.brands += 1;
    });

    restaurantsData.forEach(r => {
        const m = r.createdAt.getMonth();
        const y = r.createdAt.getFullYear();
        const target = months.find(x => x.monthNum === m && x.year === y);
        if (target) target.restaurants += 1;
    });

    usersData.forEach(u => {
        const m = u.createdAt.getMonth();
        const y = u.createdAt.getFullYear();
        const target = months.find(x => x.monthNum === m && x.year === y);
        if (target) target.users += 1;
    });

    const chartData = months.map(({ month, name, brands, restaurants, users, revenue }) => ({
        month, name, brands, restaurants, users, revenue
    }));

    return {
        stats: {
            totalBrands: { value: totalBrands, trendPercentage: "0", trendType: "neutral", trendLabel: "tháng trước" },
            totalRestaurants: { value: totalRestaurants, trendPercentage: "0", trendType: "neutral", trendLabel: "tháng trước" },
            totalUsers: { value: totalUsers, trendPercentage: "0", trendType: "neutral", trendLabel: "tháng trước" },
            totalRevenue: { value: 0, trendPercentage: "0", trendType: "neutral", trendLabel: "tháng trước" }
        },
        chartData,
        recentRequests: recentRequests.map(r => ({
            id: r.id,
            brandName: r.brandName,
            status: r.status,
            createdAt: r.createdAt.toISOString(),
            user: {
                name: r.user?.name || "No name",
                email: r.user?.email || "No email",
                avatar: r.user?.avatar || null
            }
        }))
    };
};
