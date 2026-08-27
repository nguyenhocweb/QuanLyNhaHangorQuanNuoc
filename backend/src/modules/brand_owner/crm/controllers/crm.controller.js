import { brandCrmService } from "../services/crm.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";

class BrandCrmController {
  getAnalytics = asyncHandler(async (req, res) => {
    // BrandOwner route có dạng /api/v1/brand-owner/:id_brand/crm
    const brandId = req.params.id_brand || req.user.brandId;
    const data = await brandCrmService.getCustomerAnalytics(brandId);
    
    res.status(200).json({
      message: "Lấy dữ liệu phân tích khách hàng cấp thương hiệu thành công",
      metadata: data
    });
  });

  getTransactions = asyncHandler(async (req, res) => {
    const brandId = req.params.id_brand || req.user.brandId;
    const data = await brandCrmService.getLoyaltyTransactions(brandId);
    
    res.status(200).json({
      message: "Lấy dữ liệu lịch sử tích điểm thành công",
      metadata: data
    });
  });
}

export const brandCrmController = new BrandCrmController();
