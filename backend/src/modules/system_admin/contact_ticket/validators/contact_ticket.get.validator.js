import { z } from "zod";

export const getContactTicketsValidator = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(["ALL", "OPEN", "PROCESSING", "RESOLVED", "CLOSED"]).optional().default("ALL"),
    search: z.string().optional()
  })
});
