import { prisma } from "../../../../databases/init.mongodb.js";
import { startOfWeek, endOfWeek, addDays, getDate, getMonth } from "date-fns"
const today = new Date();

const day = today.getDay();//lấy thứ trong tuần
export const countRestauran = async (where) => {
    return prisma.restaurant.count({
        where: where
    });
}
export const getRestaurants = async ({ page, limit, where }) => {
    const result = await prisma.restaurant.findMany({
        where: where,
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
            isNew: true,
            description: true,
            phoneContact: true,
            emailContact: true,
            maxPartySize: true,
            bookingWindowDays: true,
            cancellationHours: true,
            depositRequired: true,
            depositPerPax: true,
            totalRating: true,
            averageFoodRating: true,
            averageServiceRating: true,
            averageAmbianceRating: true,
            categories: {
                select: {
                    name: true,
                    bgColor: true,
                    textColor: true,
                }
            },
            operatingHours: {
                where: { day_of_week: day },
                take: 1,
                select: {
                    open_time: true,
                    close_time: true,
                }
            },

        },
    });

    return result ? result.map(({ operatingHours, brand, ...rest }) => {
        // Lấy phần tử đầu tiên nếu mảng có dữ liệu an toàn
        const hours = operatingHours?.[0];

        return {
            ...rest,
            brandName: brand?.name || "Nhà hàng Foleat",
            time: hours
                ? `${hours.open_time} - ${hours.close_time}`
                : "Hôm nay nghỉ"
        };
    }) : null;
};
const start = startOfWeek(today, { weekStartsOn: 1 }); // Thứ 2
const end = endOfWeek(today, { weekStartsOn: 1 }); // Chủ nhật

// 2. Tạo mảng 7 ngày trong tuần cho lịch định kỳ (lặp lại)
const daysInWeek = Array.from({ length: 7 }).map((_, index) => {
    const currentDate = addDays(start, index);
    return {
        day: getDate(currentDate),
        month: getMonth(currentDate) + 1, // getMonth() bắt đầu từ 0 nên phải + 1
    };
});
import { mergeWeeklySchedules} from "../../../../core/utils/buildWeeklySchedule.js"
export const getRestaurantById = async (id) => {
    const result = await prisma.restaurant.findUnique({
        where: { id: id },
        select: {
            id: true,
            name: true,
            description: true,
            imageMain: true,
            images: true,
            address: true,
            phoneContact: true,
            emailContact: true,
            brand:{
               select:{
                name:true
               }
            },
            operatingHours: {
                select: {
                    open_time: true,
                    close_time: true,
                    day_of_week: true,
                    
                }
            },

            specialSchedules: {
                where: {
                    OR: [
                        // Trường hợp 1: Ngày cụ thể nằm trong khoảng đầu tuần -> cuối tuần
                        {
                            date: {
                                gte: start,
                                lte: end,
                            },
                        },
                        // Trường hợp 2: Lịch định kỳ lặp lại trùng với 1 trong 7 ngày của tuần này
                        {
                            is_recurring: true,
                            OR: daysInWeek,
                        },
                    ],
                },
                select: {
                    close_time: true,
                    open_time: true,
                    date: true,         // Bắt buộc lấy để tính
                    month: true,        // Bắt buộc lấy để tính
                    day: true,          // Bắt buộc lấy để tính
                    is_recurring: true
                }
            }
        }
    })
    if(result){
        const {operatingHours,specialSchedules,brand,...data}=result
        return {
            ...data,
            brandName: brand?.name || "Nhà hàng Foleat",
            timeWeek:mergeWeeklySchedules(operatingHours,specialSchedules,today)
        }
    }
    return result

}