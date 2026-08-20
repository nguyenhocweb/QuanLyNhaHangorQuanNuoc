import { prisma } from "../../../../databases/init.mongodb.js";

export const assignTableRepo = async (reservationId, tableId, staffId) => {
    // 1. Kiểm tra xem bàn đã được gán cho reservation này chưa
    const existingAssign = await prisma.reservation_Tables.findFirst({
        where: {
            reservationId,
            tableId
        }
    });

    if (existingAssign) {
        return existingAssign;
    }

    // 2. Tạo liên kết (Assign)
    return prisma.reservation_Tables.create({
        data: {
            reservationId,
            tableId,
            assigned_by_staff_id: staffId
        },
        include: {
            table: true
        }
    });
};

export const unassignTableRepo = async (reservationId, tableId) => {
    // Để an toàn (vì MongoDB chưa hỗ trợ @@id([reservationId, tableId]) dễ dàng qua delete)
    // Ta tìm id của bảng trung gian trước
    const assign = await prisma.reservation_Tables.findFirst({
        where: { reservationId, tableId }
    });

    if (assign) {
        return prisma.reservation_Tables.delete({
            where: { id: assign.id }
        });
    }
    return null;
};
