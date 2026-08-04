import { updateBrandService } from "../services/brand.update.service.js";

export const updateBrandController = async (req, res) => {
    const userId = req.user.id;
    const payload = req.body;
    
    const updatedBrand = await updateBrandService(userId, payload);
    
    return res.status(200).json({
        message: "Cập nhật thương hiệu thành công",
        data: updatedBrand
    });
};
