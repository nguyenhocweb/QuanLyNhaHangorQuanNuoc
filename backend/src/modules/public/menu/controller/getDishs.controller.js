import { getDishsService } from "../service/getDishs.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getDishsController = asyncHandler(
    async (req, res) => {

        const _id = req.params._id;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const type = req.query.type;
        const search = req.query.search;
        
        
        const where = []
        if (_id) where.push(type === "isBrand" ? { brandId: _id } : { restaurantId: _id });
        if (search) where.push({
            name: {
                contains: search,// Tìm chuỗi con bên trong tên
                mode: 'insensitive',// Không phân biệt Hoa/Thường
            }
        });
        const result = await getDishsService(page, limit, where,type);
        
        switch (result.code) {
            case 404: throw new NotFoundError(result.mes);
            case 200: return res.status(200).json(result.data); break;
        }
    }
)