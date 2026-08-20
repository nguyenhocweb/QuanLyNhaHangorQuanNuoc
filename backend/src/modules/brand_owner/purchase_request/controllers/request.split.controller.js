import { previewSplitRequestsService } from "../services/request.split.service.js";

export const previewSplitRequests = async (req, res) => {
  const brandId = req.params.id_brand;
  const { requestIds } = req.body;
  
  if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
    return res.status(400).json({ message: "Vui lòng chọn ít nhất 1 Yêu cầu nhập kho" });
  }

  const result = await previewSplitRequestsService(brandId, requestIds);

  return res.status(200).json({
    message: "Phân tách gom đơn thành công",
    metadata: result
  });
};
