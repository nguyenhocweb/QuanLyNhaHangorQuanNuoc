import { getBrandRevenueSummarySchema, executeGetBrandRevenueSummary } from "./getBrandRevenueSummary.tool.js";
import { getRestaurantComparisonSchema, executeGetRestaurantComparison } from "./getRestaurantComparison.tool.js";
import { getLoyaltyMetricsSchema, executeGetLoyaltyMetrics } from "./getLoyaltyMetrics.tool.js";
import { approvePurchaseOrderSchema, executeApprovePurchaseOrder } from "./approvePurchaseOrder.tool.js";
import { manageGlobalMenuSchema, executeManageGlobalMenu } from "./manageGlobalMenu.tool.js";
import { managePromotionSchema, executeManagePromotion } from "./managePromotion.tool.js";

export const ownerTools = [
  getBrandRevenueSummarySchema,
  getRestaurantComparisonSchema,
  getLoyaltyMetricsSchema,
  approvePurchaseOrderSchema,
  manageGlobalMenuSchema,
  managePromotionSchema
];

export const ownerExecutors = {
  getBrandRevenueSummary: executeGetBrandRevenueSummary,
  getRestaurantComparison: executeGetRestaurantComparison,
  getLoyaltyMetrics: executeGetLoyaltyMetrics,
  approvePurchaseOrder: executeApprovePurchaseOrder,
  manageGlobalMenu: executeManageGlobalMenu,
  managePromotion: executeManagePromotion
};
