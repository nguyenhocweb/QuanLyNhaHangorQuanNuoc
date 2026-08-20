import { getBrands, countBrands } from "../../../system_admin/brand/repository.brand/index.js";

export const getPublicBrandsService = async (query) => {
    let { page, limit, search } = query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    
    // Đối với vãng lai, chỉ lấy danh sách thương hiệu ACTIVE
    const where = { isActive: "ACTIVE" };
    if (search) {
        where.name = { contains: search, mode: "insensitive" };
    }
    
    const [brands, total] = await Promise.all([
        getBrands({ where, page, limit }),
        countBrands(where)
    ]);
    
    return {
        code: 200,
        data: {
            data: brands,
            total
        }
    };
};
