import { payosWebhookService } from "./payos.webhook.service.js";

class PayosWebhookController {
    async handleIpn(req, res) {
        // PayOS IPN Payload
        const payload = req.body;
        
        await payosWebhookService.processIpn(payload);

        // Luôn trả về success cho webhook để cổng thanh toán không gọi lại nhiều lần
        res.json({
            success: true,
            message: "Webhook processed successfully"
        });
    }
}

export const payosWebhookController = new PayosWebhookController();
