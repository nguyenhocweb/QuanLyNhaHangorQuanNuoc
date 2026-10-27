import { z } from "zod";

export const updateContactTicketValidator = z.object({
  params: z.object({
    id: z.string().min(1, "ID không hợp lệ")
  }),
  body: z.object({
    status: z.enum(["OPEN", "PROCESSING", "RESOLVED", "CLOSED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    adminNote: z.string().nullable().optional(),
    adminReply: z.string().nullable().optional(),
    assignedTo: z.string().nullable().optional()
  })
});
