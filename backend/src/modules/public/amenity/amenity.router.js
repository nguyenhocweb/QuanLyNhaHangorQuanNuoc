import express from "express";

import { getAllAmenitiesController, getAmenityController } from "../../system_admin/amenity/controllers/getAmenity.controller.js";

const route = express.Router();

route.get("/", getAllAmenitiesController);
route.get("/:id", getAmenityController);

export default route;
