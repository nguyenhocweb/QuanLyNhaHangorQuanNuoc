import { getPublicRestaurantReviewsService } from "../services/restaurant_reviews.get.service.js";

export const getPublicRestaurantReviewsController = async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const rating = req.query.rating ? parseInt(req.query.rating) : null;
    const sortBy = req.query.sortBy || "latest";
    const hasImage = req.query.hasImage === 'true';
    
    const result = await getPublicRestaurantReviewsService(id, page, limit, rating, sortBy, hasImage);
    res.status(200).json(result);
};
