import { claimPointsService } from "../order.service/ClaimPoints.service.js";

export const claimPointsController = async (req, res) => {
  const userId = req.user.id; // Lấy từ middleware authenticateToken
  const { claimCode } = req.body;

  if (!claimCode) {
    return res.status(400).json({
      message: "Vui lòng cung cấp mã nhận điểm (claimCode) trên hóa đơn."
    });
  }

  const result = await claimPointsService(userId, claimCode);

  return res.status(200).json({
    message: result.message,
    metadata: {
      earnedPoints: result.earnedPoints
    }
  });
};
