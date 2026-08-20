import { createPurchaseRequestService } from "../services/request.create.service.js";

export const createPurchaseRequest = async (req, res) => {
  const result = await createPurchaseRequestService(req.body);
  return res.status(201).json({
    message: "Tạo yêu cầu nhập kho thành công",
    metadata: result
  });
};
