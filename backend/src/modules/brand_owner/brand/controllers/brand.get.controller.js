import { getBrandService } from "../services/brand.get.service.js";

export const getBrandController = async (req, res) => {
    const userId = req.user.id;
    const brand = await getBrandService(userId);
    
    return res.status(200).json({
        message: "Lấy thông tin thương hiệu thành công",
        data: brand
    });
};
