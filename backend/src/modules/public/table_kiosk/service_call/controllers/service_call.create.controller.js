import { createServiceCallService } from "../services/service_call.create.service.js";

export const createServiceCall = async (req, res) => {
    const { restaurantId, tableId, type, note } = req.body;

    const result = await createServiceCallService({
        restaurantId,
        tableId,
        type,
        note
    });

    return res.status(200).json({
        message: "Đã gửi yêu cầu tới nhân viên phục vụ. Nhân viên sẽ có mặt ngay!",
        metadata: result
    });
};
