import { z } from "zod"
import { validator } from "@/src/core/lib/validations";
export const InformationProfileSchema = z.object({
    id: validator.string("ID người dùng"),
    name: validator.string("Họ và tên"),
    date_of_birth: validator.dob("Ngày sinh", { minAge: 14, maxAge: 120 }).optional(),
    gender: validator.enum("Giới tính", ["Nam", "Nu", "Khac"] as const).optional()
})
export type InformationProfileForm = z.Infer<typeof InformationProfileSchema>;