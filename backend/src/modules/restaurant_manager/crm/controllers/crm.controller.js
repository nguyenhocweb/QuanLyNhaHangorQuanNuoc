import { crmService } from "../services/crm.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";

class CrmController {
  getAnalytics = asyncHandler(async (req, res) => {
    const restaurantId = req.user.restaurantId || req.query.restaurantId;
    const data = await crmService.getCustomerAnalytics(restaurantId);
    
    res.status(200).json({
      message: "Lấy dữ liệu phân tích khách hàng thành công",
      metadata: data
    });
  });
}

export const crmController = new CrmController();
