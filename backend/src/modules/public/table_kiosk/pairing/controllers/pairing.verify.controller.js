import { verifyTablePairingCodeService } from "../services/pairing.verify.service.js";

export const verifyTablePairingCode = async (req, res) => {
    const { pairingCode, deviceUUID } = req.body;

    const result = await verifyTablePairingCodeService(pairingCode, deviceUUID);

    return res.status(200).json({
        message: "Ghép nối Tablet với bàn thành công",
        metadata: result
    });
};
