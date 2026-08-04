import { getPublicMenuItemsService } from "../services/restaurant_menu_items.get.service.js";

export const getPublicMenuItemsController = async (req, res) => {
    const restaurantId = req.params.id;
    const query = req.query; // Đã qua validator xử lý parse page, limit
    
    const result = await getPublicMenuItemsService(restaurantId, query);

    return res.status(200).json({
        message: "Lấy danh sách món ăn thành công",
        metadata: result
    });
};
