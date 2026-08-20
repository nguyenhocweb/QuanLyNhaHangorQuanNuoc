import { previewSplitRequestsRepo } from "../repositories/request.split.repo.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const previewSplitRequestsService = async (brandId, requestIds) => {
  const requests = await previewSplitRequestsRepo(brandId, requestIds);

  // Lấy danh sách suppliers để map tên
  const suppliers = await prisma.supplier.findMany({ where: { brandId } });
  const supplierMap = suppliers.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  const groups = {}; // key: supplierId
  const unassigned = []; // items không có supplier

  for (const req of requests) {
    for (const item of req.items) {
      const invItem = item.inventoryItem;
      const suppId = invItem.supplierId;
      
      const mergedItem = {
        inventoryItemId: invItem.id,
        name: invItem.name,
        sku: invItem.sku,
        baseUnit: invItem.baseUnit,
        requestedQty: item.requestedQty,
        approvedQty: item.requestedQty, // Mặc định duyệt bằng xin
        unitPrice: invItem.maxPrice || 0, // Tạm lấy maxPrice làm đơn giá dự kiến
        sourceRequestIds: [req.id],
        sourceBranches: [req.restaurant?.name || 'Chi nhánh ẩn']
      };

      if (!suppId) {
        // Gom unassigned
        const existing = unassigned.find(u => u.inventoryItemId === invItem.id);
        if (existing) {
          existing.requestedQty += mergedItem.requestedQty;
          existing.approvedQty += mergedItem.approvedQty;
          if (!existing.sourceRequestIds.includes(req.id)) existing.sourceRequestIds.push(req.id);
          if (!existing.sourceBranches.includes(mergedItem.sourceBranches[0])) existing.sourceBranches.push(mergedItem.sourceBranches[0]);
        } else {
          unassigned.push(mergedItem);
        }
      } else {
        if (!groups[suppId]) {
          groups[suppId] = {
            supplierId: suppId,
            supplierName: supplierMap[suppId]?.name || "Nhà cung cấp ẩn",
            items: []
          };
        }
        
        const existing = groups[suppId].items.find(u => u.inventoryItemId === invItem.id);
        if (existing) {
          existing.requestedQty += mergedItem.requestedQty;
          existing.approvedQty += mergedItem.approvedQty;
          if (!existing.sourceRequestIds.includes(req.id)) existing.sourceRequestIds.push(req.id);
          if (!existing.sourceBranches.includes(mergedItem.sourceBranches[0])) existing.sourceBranches.push(mergedItem.sourceBranches[0]);
        } else {
          groups[suppId].items.push(mergedItem);
        }
      }
    }
  }

  return {
    groupedBySupplier: Object.values(groups),
    unassigned
  };
};
