import { prisma } from "../../../../databases/init.mongodb.js";

export const updateReservationRepo = async (id, restaurantId, staffId, data) => {
    let { table_ids, ...updateData } = data;
    if (updateData.reservation_date) {
        updateData.reservation_date = new Date(updateData.reservation_date);
    }

    if (table_ids !== undefined) {
        updateData.reservation_tables = {
            deleteMany: {},
            create: table_ids.map(tableId => ({
                tableId,
                assigned_by_staff_id: staffId
            }))
        };
    }

    return prisma.reservations.update({
        where: { id, restaurantId },
        data: updateData
    });
};
