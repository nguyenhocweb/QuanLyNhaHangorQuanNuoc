import { getRestaurantsService } from "../service.restaurant/getRestaurants.service.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getRestaurantsController = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const city = req.query.city;
    const search = req.query.search;
    const id = req.query.idBrand;
    const categoryRestaurant = req.query.category;
    const review = req.query.review ? parseInt(req.query.review) : undefined;

    const where = {};
    if (id && id.trim()) where.brandId = id.trim();
    if (city && city.trim()) where.address = { is: { province: city.trim() } };
    if (search && search.trim()) {
        where.name = {
            contains: search.trim(),
            mode: 'insensitive'
        };
    }
    if (categoryRestaurant && categoryRestaurant.trim()) {
        const catList = categoryRestaurant.split(",").map(c => c.trim()).filter(Boolean);
        if (catList.length > 0) {
            where.categoryRestaurantIds = { hasSome: catList };
        }
    }
    if (review !== undefined && !isNaN(review)) {
        where.ratingStats = {
            is: {
                averageRating: {
                    gte: Number(review)
                }
            }
        };
    }

    const result = await getRestaurantsService(page, limit, where);
    if (result.code === 404) {
        throw new NotFoundError(result.mes);
    }
    return res.status(200).json(result.data);
};