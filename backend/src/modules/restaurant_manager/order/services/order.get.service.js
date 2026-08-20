import { NotFoundError } from "../../../../core/constants/error/index.js";
import { orderGetRepo } from "../repositories/order.get.repo.js";

class OrderGetService {
  async getOrders({ restaurantId, page, limit, status, search, dateFilter }) {
    const skip = (page - 1) * limit;

    const { orders, total } = await orderGetRepo.getOrders({
      restaurantId,
      skip,
      limit,
      status,
      search,
      dateFilter
    });

    return {
      data: orders,
      meta: {
        totalRecords: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async getOrderById(id, restaurantId) {
    const order = await orderGetRepo.getOrderById(id, restaurantId);
    if (!order) {
      throw new NotFoundError("Không tìm thấy đơn hàng!");
    }
    return order;
  }
}

export const orderGetService = new OrderGetService();
