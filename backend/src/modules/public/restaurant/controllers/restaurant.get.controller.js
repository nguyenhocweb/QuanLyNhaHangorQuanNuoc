import { getPublicRestaurantService } from "../services/restaurant.get.service.js";

export const getPublicRestaurantController = async (req, res) => {
    const { id } = req.params;
    const result = await getPublicRestaurantService(id);
    res.status(200).json(result);
};
