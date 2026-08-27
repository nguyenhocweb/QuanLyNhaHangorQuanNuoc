import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getMyVoucherWalletService } from "../services/promotion.get-wallet.service.js";

export const getMyVoucherWalletController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const query = req.query;

    const result = await getMyVoucherWalletService(userId, query);

    res.status(200).json({
        message: "Lấy danh sách ví voucher thành công",
        metadata: result
    });
});
