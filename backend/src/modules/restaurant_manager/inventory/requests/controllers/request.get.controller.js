import { getPurchaseRequestsService } from "../services/request.get.service.js";

export const getPurchaseRequests = async (req, res) => {
  const result = await getPurchaseRequestsService(req.query);
  return res.status(200).json({
    message: "Lấy danh sách yêu cầu nhập kho thành công",
    metadata: result
  });
};
