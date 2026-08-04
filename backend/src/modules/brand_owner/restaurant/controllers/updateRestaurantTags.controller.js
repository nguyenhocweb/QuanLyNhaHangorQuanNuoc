import { updateRestaurantTagsService } from "../services/updateRestaurantTags.service.js";

export const updateRestaurantTagsController = async (req, res) => {
    const { id_brand, id } = req.params;

    const data = await updateRestaurantTagsService(id_brand, id, req.body);
    return res.status(200).json({
        message: "Cập nhật thẻ từ khóa thành công",
        data
    });
};
