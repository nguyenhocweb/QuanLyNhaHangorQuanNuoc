import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const updateSupplierValidator = z.object({
    params: z.object({
    supplierId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ"),
  }),
  body: z.object({
    name: demoValidator.chuoi("Tên nhà cung cấp").optional(),
    taxCode: demoValidator.chuoi("Mã số thuế").optional().or(z.literal('')),
    contact: z.object({
      contactName: demoValidator.chuoi("Tên người liên hệ").optional().or(z.literal('')),
      email: demoValidator.email("Email").optional().or(z.literal('')),
      phone: demoValidator.soDienThoai(),
      address: demoValidator.chuoi("Địa chỉ").optional().or(z.literal(''))
    }).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional()
  })
});
