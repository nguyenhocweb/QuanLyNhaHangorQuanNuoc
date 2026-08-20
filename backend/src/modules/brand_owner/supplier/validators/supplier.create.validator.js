import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const createSupplierValidator = {
  body: z.object({
    name: demoValidator.chuoi("Tên nhà cung cấp"),
    taxCode: demoValidator.chuoi("Mã số thuế").optional().or(z.literal('')),
    contact: z.object({
      contactName: demoValidator.chuoi("Tên người liên hệ").optional().or(z.literal('')),
      email: demoValidator.email("Email").optional().or(z.literal('')),
      phone: demoValidator.soDienThoai(),
      address: demoValidator.chuoi("Địa chỉ").optional().or(z.literal(''))
    }).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional()
  })
};
