import { createReservationService } from "../reservation.service/createReservation.service.js";
import { ConflictError } from "../../../../core/constants/error/index.js";

export const createReservationController = async (req, res) => {
    const data = {
        ...req.body,
        userId: req.user?.id || req.body.userId
    };
    const result = await createReservationService(data);
    switch (result.code) {
        case 201:
            return res.status(201).json({ message: result.mes || "Đặt bàn thành công", metadata: result });
        case 409: 
            throw new ConflictError(result.mes);
        default:
            return res.status(200).json({ message: result.mes || "Đặt bàn thành công", metadata: result });
    }
};