import { getBrands, countBrands } from "../repository.brand/index.js";
import { searchAIService } from "../../../public/ai/ai.service/index.js  "
export const getBrandsService = async (page, limit, city, search, status, isFeatured, isNew) => {
    const baseWhere = [];
    
    if (search) {
        baseWhere.push({ name: { contains: search, mode: 'insensitive' } });
    }
    
    if (status) {
        baseWhere.push({ isActive: status });
    }
    if (typeof isFeatured === "boolean") {
        baseWhere.push({ isFeatured: isFeatured });
    }
    if (typeof isNew === "boolean") {
        baseWhere.push({ isNew: isNew });
    }
    if (city) baseWhere.push({ restaurants: { some: { address: { is: { province: city } } } } });

    const finalWhere = baseWhere.length > 0 ? { AND: baseWhere } : {};
    
    const [brands, total] = await Promise.all([
        getBrands({
            where: finalWhere,
            page: page,
            limit: limit
        }),
        countBrands(finalWhere)
    ]);

    return { code: 200, data: { data: brands, total: total } };
}