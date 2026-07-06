import { getRestaurantsService } from "../service.restaurant/getRestaurants.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";
export const getRestaurantsController = asyncHandler(
    async (req, res) => {

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const city = req.query.city;
        const search = req.query.search;
        const id = req.query.idBrand;
        const categoryRestaurant = req.query.category;
        const review = req.query.review ? parseInt(req.query.review) : undefined;
        console.log("id", id);

        const where = {}
        if (id) where.brandId = id;
        if (city) where.address = { is: { province: city } };
        if (search) where.name = {
            contains: search,
            mode: 'insensitive'
        };
        if (categoryRestaurant) {
            where.categoryIds = { hasSome: categoryRestaurant.split(",") };
        }
        if (review !== undefined) {
            where.review = {
                gte: Number(review)
            };
        }

        const result = await getRestaurantsService(page, limit, where);
        switch (result.code) {
            case 404:
                throw new NotFoundError(result.mes)
            case 200:
                return res.status(200).json(result.data);
               

        }
    }
)