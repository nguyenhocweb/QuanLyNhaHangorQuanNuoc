import { updateRestaurantMenuService } from "../services/updateRestaurantMenu.service.js";

export const updateRestaurantMenuController = async (req, res) => {
    const { id_brand: brandId, id: restaurantId, menuItemId } = req.params;

    const data = await updateRestaurantMenuService(brandId, restaurantId, menuItemId, req.body);
    
    return res.status(200).json({
        message: "Cập nhật thiết lập món ăn thành công",
        metadata: data
    });
};
