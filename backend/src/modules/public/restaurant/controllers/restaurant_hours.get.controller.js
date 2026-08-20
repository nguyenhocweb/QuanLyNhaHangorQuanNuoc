import { getPublicRestaurantHoursService } from "../services/restaurant_hours.get.service.js";

export const getPublicRestaurantHoursController = async (req, res) => {
    const { id } = req.params;
    const result = await getPublicRestaurantHoursService(id);
    res.status(200).json(result);
};
