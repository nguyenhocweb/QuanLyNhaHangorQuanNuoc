import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { orderUpdateService } from "../services/order.update.service.js";

class OrderUpdateController {
  updateOrder = asyncHandler(async (req, res) => {
    const restaurantId = req.body.restaurantId;
    const { id } = req.params;

    const data = await orderUpdateService.updateOrder(id, restaurantId, req.body);

    res.status(200).json({
      message: "Cập nhật đơn hàng thành công",
      metadata: data
    });
  });
}

export const orderUpdateController = new OrderUpdateController();
