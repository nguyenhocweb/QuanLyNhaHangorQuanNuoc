import { prisma } from "../../../../databases/init.mongodb.js";

export const updateReservationStatusRepo = async (id, restaurantId, status, staffId, cancellation_reason = null) => {
    let updateData = { status };
    const now = new Date();

    if (status === "CONFIRMED") {
        updateData.confirmed_at = now;
    } else if (status === "CANCELLED") {
        updateData.cancelled_at = now;
        updateData.cancellation_reason = cancellation_reason;
        
        // Nếu huỷ thì cũng có thể nên giải phóng bàn đã xếp, cái đó sẽ check ở Service
    } else if (status === "SEATED") {
        updateData.seated_at = now;
    } else if (status === "COMPLETED") {
        updateData.completed_at = now;
    }

    // Có thể add thêm audit log hoặc push vào notification sau

    return prisma.reservations.update({
        where: { id, restaurantId },
        data: updateData
    });
};
