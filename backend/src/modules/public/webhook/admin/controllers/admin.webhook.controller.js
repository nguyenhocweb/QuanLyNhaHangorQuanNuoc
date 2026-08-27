import asyncHandler from "../../../../../core/utils/asyncHandler.js";
import { processAdminWebhook } from "../services/admin.webhook.service.js";

export const handleAdminWebhook = asyncHandler(async (req, res) => {
    const { gatewayCode } = req.params;
    const webhookData = req.body;

    try {
        await processAdminWebhook(gatewayCode, webhookData);
        return res.status(200).json({ success: true, message: "Webhook processed" });
    } catch (error) {
        console.error("[Admin Webhook Error]:", error);
        // Với Webhook, luôn trả về 200 để tránh đối tác retry gây spam,
        // trừ khi lỗi hạ tầng hoặc cấu hình.
        return res.status(200).json({ success: false, message: error.message });
    }
});
