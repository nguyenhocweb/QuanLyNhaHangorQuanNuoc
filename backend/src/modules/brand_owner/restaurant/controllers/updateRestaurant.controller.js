import { updateRestaurantService } from "../services/updateRestaurant.service.js";

export const updateRestaurantController = async (req, res) => {
    const { id_brand, id } = req.params;

    const data = await updateRestaurantService(id_brand, id, req.body);
    return res.status(200).json({
        message: "Cập nhật chi nhánh thành công",
        data
    });
};
