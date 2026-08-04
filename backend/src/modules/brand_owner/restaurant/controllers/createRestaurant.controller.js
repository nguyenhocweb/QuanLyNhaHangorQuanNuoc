import { createRestaurantService } from "../services/createRestaurant.service.js";

export const createRestaurantController = async (req, res) => {
    const { id_brand } = req.params;

    const data = await createRestaurantService(id_brand, req.body);
    return res.status(201).json({
        message: "Thêm chi nhánh thành công",
        data
    });
};
