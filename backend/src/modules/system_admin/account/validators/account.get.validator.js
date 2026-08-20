import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const getAccountsValidator = z.object({
  query: z.object({
    page: demoValidator.int("page", 1, 9999).optional().default(1),
    limit: demoValidator.int("limit", 1, 1000).optional().default(10),
    search: demoValidator.chuoi("search").optional(),
    role: demoValidator.chuoi("role").optional(),
    status: demoValidator.chuoi("status").optional(),
    dateFilter: demoValidator.chuoi("dateFilter").optional()
  })
});
