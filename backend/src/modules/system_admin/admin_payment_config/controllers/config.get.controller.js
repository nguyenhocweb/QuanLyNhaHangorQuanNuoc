import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getAdminPaymentConfig } from "../services/config.get.service.js";

export const getAdminPaymentConfigController = asyncHandler(async (req, res) => {
    const { systemPaymentMethodId } = req.params;
    const result = await getAdminPaymentConfig(systemPaymentMethodId);
    return res.status(200).json({
        message: "Get Admin Payment Config Success",
        metadata: result.metadata
    });
});
