import { getPublicMenuSchema, executeGetPublicMenu } from "./getPublicMenu.tool.js";
import { createReservationSchema, executeCreateReservation } from "./createReservation.tool.js";

// Khai báo mảng Schema (Dành cho Gemini / OpenAI)
export const customerTools = [
  getPublicMenuSchema,
  createReservationSchema
];

// Khai báo mảng Function Executors (Dành cho Function Caller)
export const customerExecutors = {
  getPublicMenu: executeGetPublicMenu,
  createReservation: executeCreateReservation
};
