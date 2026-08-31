import { createDineInOrderService } from "../order.service/dine_in_order.create.service.js";

export const createDineInOrderController = async (req, res) => {
    const userId = req.user?.id || null;
    const body = req.body;

    const result = await createDineInOrderService(userId, body);

    res.status(201).json(result);
};
