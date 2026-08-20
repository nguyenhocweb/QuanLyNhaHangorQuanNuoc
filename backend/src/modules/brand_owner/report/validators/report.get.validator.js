import { z } from "zod";

export const getReportValidator = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional()
  }).refine((data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  }, {
    message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
    path: ["startDate"]
  })
});
