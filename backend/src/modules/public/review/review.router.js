import { Router } from "express";
import { getFeaturedReviewsController } from "./controllers/review.get-featured.controller.js";

const route = Router();

route.get("/featured", getFeaturedReviewsController);
route.get("", getFeaturedReviewsController);

export default route;
