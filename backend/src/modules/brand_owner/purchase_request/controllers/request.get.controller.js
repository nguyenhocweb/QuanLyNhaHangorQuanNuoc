import { getPurchaseRequestsService } from "../services/request.get.service.js";

export const getBrandPurchaseRequests = async (req, res) => {
  const brandId = req.params.id_brand;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;

  const result = await getPurchaseRequestsService(brandId, filter, page, limit);

  return res.status(200).json({
    message: "Lấy danh sách yêu cầu nhập kho thành công",
    metadata: result
  });
};
