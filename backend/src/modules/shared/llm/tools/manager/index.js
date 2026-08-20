import { getBranchOrdersSchema, executeGetBranchOrders } from "./getBranchOrders.tool.js";
import { getBranchReservationsSchema, executeGetBranchReservations } from "./getBranchReservations.tool.js";
import { getLowStockAlertsSchema, executeGetLowStockAlerts } from "./getLowStockAlerts.tool.js";
import { getBranchEmployeesSchema, executeGetBranchEmployees } from "./getBranchEmployees.tool.js";
import { createPurchaseRequestSchema, executeCreatePurchaseRequest } from "./createPurchaseRequest.tool.js";
import { updateOrderStatusSchema, executeUpdateOrderStatus } from "./updateOrderStatus.tool.js";
import { getBranchInventorySchema, executeGetBranchInventory } from "./getBranchInventory.tool.js";
import { getPublicMenuSchema, executeGetPublicMenu } from "../customer/getPublicMenu.tool.js";

export const managerTools = [
  getBranchOrdersSchema,
  getBranchReservationsSchema,
  getLowStockAlertsSchema,
  getBranchEmployeesSchema,
  createPurchaseRequestSchema,
  updateOrderStatusSchema,
  getBranchInventorySchema,
  getPublicMenuSchema
];

export const managerExecutors = {
  getBranchOrders: executeGetBranchOrders,
  getBranchReservations: executeGetBranchReservations,
  getLowStockAlerts: executeGetLowStockAlerts,
  getBranchEmployees: executeGetBranchEmployees,
  createPurchaseRequest: executeCreatePurchaseRequest,
  updateOrderStatus: executeUpdateOrderStatus,
  getBranchInventory: executeGetBranchInventory,
  getPublicMenu: executeGetPublicMenu
};
