import { cancelTableKioskOrderItemService } from "../services/order.cancel_item.service.js";

export const cancelTableKioskOrderItem = async (req, res) => {
    const { restaurantId, tableId, orderItemId, reason } = req.body;
    const result = await cancelTableKioskOrderItemService({
        restaurantId,
        tableId,
        orderItemId,
        reason
    });

    return res.status(200).json({
        message: result.message,
        metadata: result.order
    });
};
