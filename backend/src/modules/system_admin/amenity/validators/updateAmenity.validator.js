import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateAmenityValidator = z.object({
  body: z.object({
    name: demoValidator.chuoiKhongBatBuoc("Tên tiện ích"),
    description: demoValidator.chuoiKhongBatBuoc("Mô tả"),
    icon: demoValidator.chuoiKhongBatBuoc("Icon"),
  })
});
