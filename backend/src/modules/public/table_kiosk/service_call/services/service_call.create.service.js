import { prisma } from "../../../../../databases/init.mongodb.js";
import { NotFoundError } from "../../../../../core/constants/error/index.js";
import { getIO } from "../../../../../core/utils/socket.js";

export const createServiceCallService = async ({ restaurantId, tableId, type = "CALL_STAFF", note = "" }) => {
    const table = await prisma.tables.findFirst({
        where: { id: tableId, restaurantId },
        include: { restaurant: true }
    });

    if (!table) {
        throw new NotFoundError("Không tìm thấy bàn yêu cầu");
    }

    const typeLabels = {
        CALL_STAFF: "Gọi nhân viên phục vụ",
        WATER: "Xin thêm nước lọc / trà đá",
        ICE: "Xin thêm xô đá",
        BILL_CASH: "Yêu cầu thanh toán tiền mặt",
        CLEAN_TABLE: "Yêu cầu dọn bớt đĩa trống",
        OTHER: "Yêu cầu hỗ trợ khác"
    };

    const requestPayload = {
        id: `SR-${Date.now()}`,
        restaurantId,
        tableId,
        tableNumber: table.table_number,
        type,
        label: typeLabels[type] || "Gọi phục vụ",
        note,
        createdAt: new Date().toISOString()
    };

    try {
        const io = getIO();
        io.to(`restaurant_${restaurantId}`).emit("new_service_request", requestPayload);
        io.emit("new_service_request", requestPayload);
    } catch (err) {
        console.error("Socket emit service call error:", err);
    }

    return requestPayload;
};
