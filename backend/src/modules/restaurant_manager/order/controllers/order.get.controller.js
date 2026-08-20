import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { orderGetService } from "../services/order.get.service.js";

class OrderGetController {
  getOrders = asyncHandler(async (req, res) => {
    const restaurantId = req.query.restaurantId;
    const { page, limit, status, search, dateFilter } = req.query;

    const data = await orderGetService.getOrders({
      restaurantId,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      search,
      dateFilter
    });

    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công",
      metadata: data
    });
  });

  getOrderById = asyncHandler(async (req, res) => {
    const restaurantId = req.query.restaurantId;
    const { id } = req.params;

    const data = await orderGetService.getOrderById(id, restaurantId);

    res.status(200).json({
      message: "Lấy thông tin đơn hàng thành công",
      metadata: data
    });
  });
}

export const orderGetController = new OrderGetController();
