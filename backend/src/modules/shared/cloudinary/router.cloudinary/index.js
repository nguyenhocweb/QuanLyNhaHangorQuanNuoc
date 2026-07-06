import {Router} from "express";
import { validate } from "../../../../core/middlewares/validator.middleware.js";
import { cloudinarySignatureController } from "../controller.cloudinary/cloudinary-signature.js";
import { cloudinarySignatureValidator } from "../validatory.cloudinary/cloudinarySignature.validator.js";
import { cloudinarySignatureBulkController } from "../controller.cloudinary/cloudinary-signature-bulk.js";
import { cloudinarySignatureBulkValidator } from "../validatory.cloudinary/cloudinarySignatureBulk.validator.js";

const route=Router();

route.get("/image",validate(cloudinarySignatureValidator),cloudinarySignatureController);
route.get("/images",validate(cloudinarySignatureBulkValidator),cloudinarySignatureBulkController);

export default route