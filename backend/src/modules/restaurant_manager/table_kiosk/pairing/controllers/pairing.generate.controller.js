import { generateTablePairingCodeService } from "../services/pairing.generate.service.js";

export const generateTablePairingCode = async (req, res) => {
    const { tableId } = req.body;
    const restaurantId = req.restaurantId || req.user?.restaurantId || req.body.restaurantId;

    const result = await generateTablePairingCodeService(restaurantId, tableId);

    return res.status(200).json({
        message: "Tạo mã kết nối Tablet thành công",
        metadata: result
    });
};
