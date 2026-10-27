import { Router } from "express";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { createWebAuthorValidator } from "./validators/web_author.create.validator.js";
import { updateWebAuthorValidator } from "./validators/web_author.update.validator.js";
import * as createController from "./controllers/web_author.create.controller.js";
import * as getController from "./controllers/web_author.get.controller.js";
import * as updateController from "./controllers/web_author.update.controller.js";
import * as deleteController from "./controllers/web_author.delete.controller.js";

const route = Router();

// 1. Lấy danh sách toàn bộ thành viên
route.get("/", getController.getAdminAuthors);

// 2. Lấy chi tiết 1 thành viên
route.get("/:id", getController.getAuthorById);

// 3. Thêm thành viên mới
route.post("/", validate(createWebAuthorValidator), createController.createWebAuthor);

// 4. Cập nhật thông tin thành viên
route.patch("/:id", validate(updateWebAuthorValidator), updateController.updateWebAuthor);

// 5. Xóa thành viên
route.delete("/:id", deleteController.deleteWebAuthor);

export default route;
