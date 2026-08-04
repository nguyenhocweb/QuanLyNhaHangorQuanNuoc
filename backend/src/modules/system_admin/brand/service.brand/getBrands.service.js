import { getBrands, countBrands } from "../repository.brand/index.js";
import { searchAIService } from "../../../public/ai/ai.service/index.js  "
export const getBrandsService = async (page, limit, city, search, status, isFeatured, isNew) => {
    let brandIds = [];
    if (search) {
        const aiResult = await searchAIService({ query: search, topK: 20 });
        if (!aiResult || aiResult.length === 0) {
            return { code: 404, mes: "không tìm thấy tài nguyên" };
        }
        brandIds = aiResult.filter(result => result.type === "brand").map(result => result.id);

    }
    const baseWhere = [];
    
    if (status) {
        baseWhere.push({ isActive: status });
    }
    if (typeof isFeatured === "boolean") {
        baseWhere.push({ isFeatured: isFeatured });
    }
    if (typeof isNew === "boolean") {
        baseWhere.push({ isNew: isNew });
    }
    if (brandIds.length > 0) baseWhere.push({ id: { in: brandIds } });
    if (city) baseWhere.push({ restaurants: { some: { address: { is: { province: city } } } } });

    const finalWhere = {
        AND: baseWhere
    };
    const [brands, total] = await Promise.all([
        getBrands({
            where: finalWhere,
            page: page,
            limit: limit
        }),
        countBrands(finalWhere)
    ])
    let resultBrand = brands;
    // sắp xếp theo tìm kiêm AI
    if (brandIds.length > 0) {
        resultBrand = brandIds.map(id => brands.find(brand => brand.id === id)).filter(Boolean);
        console.log(brandIds);
        
        console.log("resultBrand:", resultBrand);
    }

    return resultBrand.length > 0 ? { code: 200, data: { data: resultBrand, total: total } } : { code: 404, mes: "không tìm thấy tài nguyên" }
}