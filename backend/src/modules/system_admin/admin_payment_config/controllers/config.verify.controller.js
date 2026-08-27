import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { verifyAdminPaymentConfigService } from "../services/config.verify.service.js";

export const verifyAdminPaymentConfigController = asyncHandler(async (req, res) => {
    const { systemPaymentMethodId } = req.params;
    
    // Call service to generate 1,000 VND test QR or URL
    const result = await verifyAdminPaymentConfigService(systemPaymentMethodId);
    
    return res.status(200).json({
        message: "Create Test Payment Success",
        metadata: result
    });
});
