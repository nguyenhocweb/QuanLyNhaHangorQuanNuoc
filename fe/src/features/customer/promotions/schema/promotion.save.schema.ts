import { z } from "zod";
import { validator } from "@/src/core/lib/validations";

export const saveVoucherSchema = z.object({
    identifier: validator.string("Mã khuyến mãi hoặc ID")
});

export type SaveVoucherFormValues = z.infer<typeof saveVoucherSchema>;
