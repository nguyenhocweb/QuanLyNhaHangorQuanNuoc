import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { upsertAdminPaymentConfig } from "../services/config.upsert.service.js";

export const upsertAdminPaymentConfigController = asyncHandler(async (req, res) => {
    const { systemPaymentMethodId } = req.params;
    const { configData, isActive } = req.body;
    
    const result = await upsertAdminPaymentConfig(systemPaymentMethodId, configData, isActive);
    return res.status(200).json({
        message: "Upsert Admin Payment Config Success",
        metadata: result.metadata
    });
});
