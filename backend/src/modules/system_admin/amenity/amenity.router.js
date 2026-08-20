import express from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";

import { createAmenityValidator } from "./validators/createAmenity.validator.js";
import { updateAmenityValidator } from "./validators/updateAmenity.validator.js";

import { createAmenityController } from "./controllers/createAmenity.controller.js";
import { getAllAmenitiesController, getAmenityController } from "./controllers/getAmenity.controller.js";
import { updateAmenityController } from "./controllers/updateAmenity.controller.js";
import { deleteAmenityController } from "./controllers/deleteAmenity.controller.js";

const route = express.Router();

route.post("/", validate(createAmenityValidator), createAmenityController);
route.get("/", getAllAmenitiesController);
route.get("/:id", getAmenityController);
route.put("/:id", validate(updateAmenityValidator), updateAmenityController);
route.delete("/:id", deleteAmenityController);

export default route;
