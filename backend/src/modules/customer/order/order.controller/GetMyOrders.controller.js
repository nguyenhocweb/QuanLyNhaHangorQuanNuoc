import { getMyOrdersService } from "../order.service/GetMyOrders.service.js";

export const getMyOrdersController = async (req, res) => {
    const userId = req.user.id;
    const query = req.query;

    const result = await getMyOrdersService(userId, query);

    res.status(200).json({
        message: "Lấy danh sách đơn hàng thành công",
        metadata: result
    });
};
