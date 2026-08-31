import { prisma } from "../../../../databases/init.mongodb.js"
const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};
const endOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};
// lấy all cả các table và khu khu vực tầng nếu có
export const getAreasAndTables = async (idRestaurant) => {
    const result = await prisma.restaurant_Areas.findMany({
        where: {
            restaurantId: idRestaurant,
            is_active: "ACTIVE",
        },
        orderBy: {
            floor_number: "asc"
        },
        select: {
            floor_number: true,
            is_outdoor: true,
            name: true,
            smoking_allowed: true,
            description: true,
            tabels: {
                select: {
                    id:true,
                    table_number: true,
                    min_capacity: true,
                    max_capacity: true,
                    shape: true
                }
            }
        }
    })
    return result ?? null
}
// lấy các id table bị chiếm với đk
// giờ bị chiêm trong khung giờ và ngày của khách

export const getTableAvailability = async (IdRestaurant, reservation_date, start_time, end_time) => {
    const result = await prisma.reservation_Tables.findMany({
        where: {
            reservation: {
                restaurantId:IdRestaurant,
                reservation_date: {
                    gte: startOfDay(reservation_date),
                    lte: endOfDay(reservation_date),
                },
                status: { notIn: ["CANCELLED"] },
                // overlap condition
                AND: [
                    { start_time: { lt: end_time } },
                    { end_time: { gt: start_time } },
                ]
            }
        },
        select: { tableId: true }
    });
   
    return result?result.map(e=>e.tableId):null
}
