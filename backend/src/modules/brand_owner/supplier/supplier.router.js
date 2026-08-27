import { Router } from "express";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";
import { getSuppliersController } from "./controllers/supplier.get.controller.js";
import { createSupplierController } from "./controllers/supplier.create.controller.js";
import { updateSupplierController } from "./controllers/supplier.update.controller.js";
import { deleteSupplierController } from "./controllers/supplier.delete.controller.js";
import { createSupplierValidator } from "./validators/supplier.create.validator.js";
import { updateSupplierValidator } from "./validators/supplier.update.validator.js";

const supplierRouter = Router({ mergeParams: true });

// Lấy danh sách nhà cung cấp của thương hiệu
supplierRouter.get("/", authorizeRole("Quản lý thương hiệu"), getSuppliersController);

// Thêm nhà cung cấp mới
supplierRouter.post("/", authorizeRole("Quản lý thương hiệu"), validate(createSupplierValidator), createSupplierController);

// Cập nhật nhà cung cấp
supplierRouter.put("/:supplierId", authorizeRole("Quản lý thương hiệu"), validate(updateSupplierValidator), updateSupplierController);

// Xóa nhà cung cấp
supplierRouter.delete("/:supplierId", authorizeRole("Quản lý thương hiệu"), deleteSupplierController);

export default supplierRouter;
