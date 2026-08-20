import { getBrands } from "../repository.brand/index.js";
export const getBrandsService = async (page, limit) => {
    const result = await getBrands({
        where: {
            AND:[
                {isActive:"ACTIVE"},
                {isFeatured:false}
            ]
        },
        page: page,
        limit: limit
    });
    return result?{code:200,data:result}:{code:404,mes:"không tìm thấy tài nguyên"}
}