import { getRestaurantsService } from "../services/getRestaurants.service.js";

export const getRestaurantsController = async (req, res) => {
    const { id_brand } = req.params;

    const data = await getRestaurantsService(id_brand);
    return res.status(200).json(data);
};
