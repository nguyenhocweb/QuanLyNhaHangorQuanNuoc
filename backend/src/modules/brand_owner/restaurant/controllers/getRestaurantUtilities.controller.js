import { getRestaurantUtilitiesService } from "../services/getRestaurantUtilities.service.js";

export const getRestaurantUtilitiesController = async (req, res) => {
    const { id_brand, id } = req.params;

    const data = await getRestaurantUtilitiesService(id_brand, id);
    return res.status(200).json(data);
};
