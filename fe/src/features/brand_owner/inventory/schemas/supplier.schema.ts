import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const supplierSchema = z.object({
  name: validator.string("Tên nhà cung cấp"),
  taxCode: validator.string("Mã số thuế").optional().or(z.literal("")),
  contact: z.object({
    contactName: validator.string("Tên người liên hệ").optional().or(z.literal("")),
    email: validator.email().optional().or(z.literal("")),
    phone: validator.phone(),
    address: validator.string("Địa chỉ").optional().or(z.literal(""))
  }).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
