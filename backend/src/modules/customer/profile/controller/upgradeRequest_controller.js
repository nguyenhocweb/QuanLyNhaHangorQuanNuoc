import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { upgradeRequestService } from "../service/upgradeRequest_service.js";

export const upgradeRequestController = asyncHandler(
    async (req, res) => {
        const userId = req.user.id;
        const data = req.body;
        
        const result = await upgradeRequestService(userId, data);
        
        return res.status(201).json({
            message: "Đã gửi yêu cầu đăng ký đối tác thành công",
            data: result
        });
    }
);
