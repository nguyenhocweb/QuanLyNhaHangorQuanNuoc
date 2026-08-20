import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Lấy danh sách API Key khả dụng (Sắp xếp theo thứ tự ưu tiên Failover)
 * 1. Key riêng của Brand (BrandId matches, Model khớp hoặc All Model)
 * 2. Key chung của Admin (Global) (BrandId = null)
 * Bỏ qua các key bị REVOKED hoặc SUSPENDED
 */
export const fetchSortedApiKeys = async (brandId) => {
  const keys = await prisma.apiKey.findMany({
    where: {
      status: 'ACTIVE',
      OR: [
        { brandId: brandId }, // Key của riêng thương hiệu
        { brandId: null }     // Key dùng chung của hệ thống (Admin Global)
      ]
    },
    include: {
      chatbox: true,
      restrictedModel: true
    }
  });

  if (!keys || keys.length === 0) {
    throw new Error("Không tìm thấy API Key nào khả dụng trong hệ thống.");
  }

  // Sắp xếp: Ưu tiên Key của Brand lên đầu, Key Admin xuống cuối để tối ưu chi phí
  keys.sort((a, b) => {
    if (a.brandId && !b.brandId) return -1;
    if (!a.brandId && b.brandId) return 1;
    
    // Nếu cùng mức brand ưu tiên, ưu tiên Key có restrictedModel (cụ thể hơn)
    if (a.restrictedModelId && !b.restrictedModelId) return -1;
    if (!a.restrictedModelId && b.restrictedModelId) return 1;
    
    return 0;
  });

  return keys;
};

// --- BATCHING AUDIT LOG OPTIMIZATION ---
// Sử dụng Map để gom nhóm (De-duplicate) các lượt gọi cùng một KeyID trong 5 giây
let auditLogQueue = new Map(); // keyId -> ipAddress
let auditLogTimer = null;

const flushAuditLogs = async () => {
  if (auditLogQueue.size === 0) return;
  
  // Clone hàng đợi và làm trống để tiếp nhận các log mới ngay lập tức
  const queueToProcess = new Map(auditLogQueue);
  auditLogQueue.clear();
  
  try {
    // Chạy các lệnh update song song. Nhờ dùng Map, mỗi keyId chỉ gọi Update tối đa 1 lần mỗi 5 giây
    const updatePromises = Array.from(queueToProcess.entries()).map(([id, ip]) => {
      return prisma.apiKey.update({
        where: { id: id },
        data: {
          lastUsedAt: new Date(),
          lastIp: ip
        }
      });
    });
    
    await Promise.allSettled(updatePromises);
  } catch (error) {
    console.error("[Audit Log Batch Error]", error.message);
  }
};

/**
 * Cập nhật Audit Trail sau khi dùng Key thành công (In-Memory Batching)
 */
export const updateKeyAuditTrail = async (keyId, ipAddress = "System") => {
  // Thêm vào hàng đợi (Nếu trùng keyId sẽ ghi đè, tiết kiệm DB call)
  auditLogQueue.set(keyId, ipAddress);
  
  // Bật bộ đếm thời gian nếu chưa bật
  if (!auditLogTimer) {
    auditLogTimer = setTimeout(() => {
      flushAuditLogs();
      auditLogTimer = null;
    }, 5000); // Flush mỗi 5 giây
  }
};
