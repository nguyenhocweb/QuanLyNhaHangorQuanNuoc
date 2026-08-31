import { getActiveOrderByReservationService } from "../order.service/dine_in_order.get_by_reservation.service.js";

export const getActiveOrderByReservationController = async (req, res) => {
    const { reservationId } = req.params;

    const result = await getActiveOrderByReservationService(reservationId);

    res.status(200).json(result);
};
