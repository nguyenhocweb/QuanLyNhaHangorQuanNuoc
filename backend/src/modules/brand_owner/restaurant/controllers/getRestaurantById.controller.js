import { getRestaurantByIdService } from "../services/getRestaurantById.service.js";

export const getRestaurantByIdController = async (req, res) => {
    const { id_brand, id } = req.params;

    const data = await getRestaurantByIdService(id_brand, id);
    return res.status(200).json(data);
};
