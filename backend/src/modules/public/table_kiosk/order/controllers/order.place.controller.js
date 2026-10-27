import { placeTableKioskOrderService } from "../services/order.place.service.js";

export const placeTableKioskOrder = async (req, res) => {
    const { restaurantId, tableId, items, reservationId, customerNotes } = req.body;

    const result = await placeTableKioskOrderService({
        restaurantId,
        tableId,
        items,
        reservationId,
        customerNotes
    });

    return res.status(200).json({
        message: "Gửi gọi món vào bếp thành công! Bếp đang chuẩn bị món cho quý khách.",
        metadata: result
    });
};
