import { prisma } from "../../../databases/init.mongodb.js";

const today = new Date();

const day = today.getDay();//lấy thứ trong tuần
export const countRestauran = async (where) => {
    return prisma.restaurant.count({
        where: {
            isActive: "ACTIVE", // Chỉ đếm những nhà hàng đang hoạt động,
            ...where
        }
    });
}
export const getRestaurants = async ({ page, limit }) => {
    const result = await prisma.restaurant.findMany({
        where: { isActive: "ACTIVE" },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
            { isNew: "desc" },
            { weightedScore: "desc" }
        ],
        select: {
            id: true,
            name: true,
            brand: {
                select: { name: true, }
            },
            imageMain: true,
            averageRating: true,
            address: true,
            isNew:true,
            operating_hours: {
                where: { day_of_week: day },
                take: 1,
                select: {
                    open_time: true,
                    close_time: true,
                }
            },
        },
    });

    return result ? result.map(({ operating_hours, brand, ...rest }) => {
        // Lấy phần tử đầu tiên nếu mảng có dữ liệu
        const hours = operating_hours[0];

        return {
            ...rest,
            brandName: brand.name,
            time: hours
                ? `${hours.open_time} - ${hours.close_time}`
                : "Hôm nay nghỉ"
        };
    }) : null;
};