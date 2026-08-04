import { getPublicRestaurantMenuService } from "../services/restaurant_menu.get.service.js";

export const getPublicRestaurantMenuController = async (req, res) => {
    const { id } = req.params;
    const result = await getPublicRestaurantMenuService(id);
    res.status(200).json(result);
};
