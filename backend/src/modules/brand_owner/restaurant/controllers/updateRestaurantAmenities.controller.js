import { updateRestaurantAmenitiesService } from "../services/updateRestaurantAmenities.service.js";

export const updateRestaurantAmenitiesController = async (req, res) => {
    const { id_brand, id } = req.params;

    const data = await updateRestaurantAmenitiesService(id_brand, id, req.body);
    return res.status(200).json({
        message: "Cập nhật tiện ích thành công",
        data
    });
};
