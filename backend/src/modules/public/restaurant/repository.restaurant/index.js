import { prisma } from "../../../../databases/init.mongodb.js";

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
            address: true,
            isNew: true,
            description: true,
            phone_contact: true,
            email_contact: true,
            ratingStats: {
                select: {
                    averageRating: true,
                    totalRating: true,
                    food: true,
                    service: true,
                    ambiance: true,
                }
            },
            bookingConfig: {
                select: {
                    maxPartySize: true,
                    bookingWindowDays: true,
                    cancellationHours: true,
                    depositRequired: true,
                    depositAmount: true,
                }
            },
            categoryRestaurants: {
                select: {
                    name: true,
                    bgColor: true,
                    textColor: true,
                }
            },
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

    return result ? result.map(({ operating_hours, brand, ratingStats, bookingConfig, categoryRestaurants, ...rest }) => {
        // Lấy phần tử đầu tiên nếu mảng có dữ liệu an toàn
        const hours = operating_hours?.[0];

        return {
            ...rest,
            brandName: brand?.name || "Nhà hàng Foleat",
            averageRating: ratingStats?.averageRating || 0,
            totalRating: ratingStats?.totalRating || 0,
            averageFoodRating: ratingStats?.food || 0,
            averageServiceRating: ratingStats?.service || 0,
            averageAmbianceRating: ratingStats?.ambiance || 0,
            maxPartySize: bookingConfig?.maxPartySize || null,
            bookingWindowDays: bookingConfig?.bookingWindowDays || null,
            cancellationHours: bookingConfig?.cancellationHours || null,
            depositRequired: bookingConfig?.depositRequired || false,
            depositPerPax: bookingConfig?.depositAmount || null,
            phoneContact: rest.phone_contact,
            emailContact: rest.email_contact,
            categories: categoryRestaurants,
            time: hours
                ? `${hours.open_time} - ${hours.close_time}`
                : "Hôm nay nghỉ"
        };
    }) : null;
};
const start = new Date(today);
const diff = today.getDay() === 0 ? -6 : 1 - today.getDay();
start.setDate(today.getDate() + diff);
start.setHours(0, 0, 0, 0);

const end = new Date(start);
end.setDate(start.getDate() + 6);
end.setHours(23, 59, 59, 999);

// 2. Tạo mảng 7 ngày trong tuần cho lịch định kỳ (lặp lại)
const daysInWeek = Array.from({ length: 7 }).map((_, index) => {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + index);
    return {
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1, // getMonth() bắt đầu từ 0 nên phải + 1
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
            phone_contact: true,
            email_contact: true,
            brand:{
               select:{
                name:true
               }
            },
            operating_hours: {
                select: {
                    open_time: true,
                    close_time: true,
                    day_of_week: true,
                    
                }
            },

            special_schedules: {
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
        const {operating_hours,special_schedules,brand,...data}=result
        return {
            ...data,
            brandName: brand?.name || "Nhà hàng Foleat",
            timeWeek:mergeWeeklySchedules(operating_hours,special_schedules,today)
        }
    }
    return result

}