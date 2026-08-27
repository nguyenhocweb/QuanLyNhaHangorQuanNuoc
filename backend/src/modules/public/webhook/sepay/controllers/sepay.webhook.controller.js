import asyncHandler from "../../../../../core/utils/asyncHandler.js";
import { handleSepayWebhookLogic } from "../services/sepay.webhook.service.js";

export const handleSepayWebhook = asyncHandler(async (req, res) => {
    const { token } = req.query;
    const webhookData = req.body;

    // Toàn bộ logic đã được chuyển xuống Service.
    // Nếu có lỗi (VD: Sai token), Service sẽ throw Error và asyncHandler sẽ bắt,
    // sau đó truyền cho Global Error Handler. 
    // Tuy nhiên, đối với Webhook, đối tác thường mong đợi mã 200 để không retry,
    // trừ khi lỗi đó là lỗi hạ tầng (500). Nhưng với ForbiddenError (sai chữ ký), 
    // Global Error Handler sẽ trả về 403.
    await handleSepayWebhookLogic(token, webhookData);

    // Dù thành công hay là giao dịch bị ignore, luôn trả về 200 cho SePay.
    return res.status(200).json({ success: true, message: "Webhook received" });
});
