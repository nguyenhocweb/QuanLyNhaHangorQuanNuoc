import { rejectPurchaseRequestsService } from "../services/request.reject.service.js";

export const rejectPurchaseRequests = async (req, res) => {
  const brandId = req.params.id_brand;
  const { requestIds } = req.body;
  
  const result = await rejectPurchaseRequestsService(brandId, requestIds);

  return res.status(200).json({
    message: "Từ chối Yêu cầu nhập kho thành công",
    metadata: result
  });
};
