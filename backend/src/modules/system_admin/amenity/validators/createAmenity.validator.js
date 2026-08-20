import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const createAmenityValidator = z.object({
  body: z.object({
    name: demoValidator.chuoi("Tên tiện ích"),
    description: demoValidator.chuoiKhongBatBuoc("Mô tả"),
    icon: demoValidator.chuoiKhongBatBuoc("Icon"),
  })
});
