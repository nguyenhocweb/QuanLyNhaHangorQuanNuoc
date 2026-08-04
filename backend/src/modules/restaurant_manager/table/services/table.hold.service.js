import { prisma } from "../../../../databases/init.mongodb.js";
import redisClient from "../../../../databases/init.redis.js";
import { getIO } from "../../../../core/utils/socket.js";
import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";

const HOLD_TTL_SECONDS = 180; // 3 phút

export const holdTableService = async (tableId, userId) => {
    // 1. Kiểm tra xem bàn có tồn tại không
    const table = await prisma.tables.findUnique({
        where: { id: tableId },
        select: { id: true, restaurantId: true, status: true }
    });

    if (!table) {
        throw new NotFoundError("Bàn không tồn tại");
    }

    if (table.status !== "ACTIVE") { // Hoặc check thêm trạng thái nếu bàn đang hỏng/bảo trì
         throw new ConflictError("Bàn không khả dụng để đặt");
    }

    // 2. Thử lấy Lock từ Redis
    const lockKey = `lock:table:${tableId}`;
    
    // Set NX (chỉ set nếu key chưa tồn tại), EX (thiết lập thời gian hết hạn)
    // Value có thể là userId để biết ai đang giữ
    const lockAcquired = await redisClient.set(lockKey, userId, "EX", HOLD_TTL_SECONDS, "NX");

    if (!lockAcquired) {
        // Kiểm tra xem user hiện tại có phải là người đang giữ khóa không (nếu click lại)
        const currentHolder = await redisClient.get(lockKey);
        if (currentHolder === userId) {
            // Có thể làm mới thời gian giữ (tuỳ logic kinh doanh)
            // await redisClient.expire(lockKey, HOLD_TTL_SECONDS);
            return {
                tableId,
                status: "HOLDING",
                message: "Bạn đã giữ bàn này rồi",
                timeRemaining: HOLD_TTL_SECONDS
            };
        }
        
        throw new ConflictError("Bàn đang được người khác giữ chỗ. Vui lòng chọn bàn khác.");
    }

    // 3. Khóa thành công -> Phát sự kiện qua WebSockets
    const io = getIO();
    // Bắn sự kiện tới tất cả client đang join trong room của nhà hàng đó
    io.to(table.restaurantId).emit("table_status_changed", {
        tableId: table.id,
        restaurantId: table.restaurantId,
        status: "HOLDING",
        heldBy: userId,
        expiresIn: HOLD_TTL_SECONDS
    });

    // 4. (Tùy chọn) Lên lịch (setTimeout hoặc job) để bắn sự kiện khi hết hạn lock nếu khách ko mua
    // Dùng Redis Keyspace Notifications là cách tốt nhất, nhưng đơn giản hơn là emit socket ngay từ client khi đếm ngược về 0.

    return {
        tableId: table.id,
        status: "HOLDING",
        heldBy: userId,
        expiresIn: HOLD_TTL_SECONDS
    };
};
