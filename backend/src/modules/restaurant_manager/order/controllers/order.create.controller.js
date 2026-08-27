import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { orderCreateService } from "../services/order.create.service.js";

class OrderCreateController {
  createOrder = asyncHandler(async (req, res) => {
    const { id: empId } = req.user;
    const restaurantId = req.body.restaurantId;
    const data = await orderCreateService.createOrder({
      restaurantId,
      takenByEmpId: empId,
      ...req.body
    });

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      metadata: data
    });
  });
}

export const orderCreateController = new OrderCreateController();
