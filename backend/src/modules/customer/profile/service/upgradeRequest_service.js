import { createUpgradeRequest, updateUpgradeRequest, findUpgradeRequestByUserId } from "../repository/index.js";
import { ConflictError } from "../../../../core/constants/error/index.js";

export const upgradeRequestService = async (userId, data) => {
    const existingRequest = await findUpgradeRequestByUserId(userId);

    if (existingRequest) {
        if (existingRequest.status === "PENDING") {
            throw new ConflictError("Bạn đã có đơn yêu cầu đang chờ xử lý. Vui lòng chờ phản hồi từ quản trị viên.");
        }
        
        if (existingRequest.status === "APPROVED") {
            throw new ConflictError("Yêu cầu trước đó của bạn đã được phê duyệt. Bạn đã là đối tác của hệ thống.");
        }

        if (existingRequest.status === "REJECTED") {
            // Nộp lại đơn bị từ chối
            const payload = {
                ...data,
                status: "PENDING",
            };
            return await updateUpgradeRequest(userId, payload);
        }
    }

    // Nếu chưa có đơn nào thì tạo mới
    const payload = {
        ...data,
        userId,
        status: "PENDING"
    };

    return await createUpgradeRequest(payload);
};
