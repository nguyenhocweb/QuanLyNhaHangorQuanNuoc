import { prisma } from "../../../databases/init.mongodb.js";
import { emitNewNotification, emitGlobalNotification } from "../../../core/utils/socket.js";

/**
 * Service Core xử lý việc tạo thông báo và đẩy qua Socket.io
 */
export const pushNotificationService = {
  /**
   * Gửi thông báo cho 1 nhóm Khách hàng / Người dùng
   */
  pushToCustomer: async ({ userIds = [], isAllOfType, title, body, type, referenceId, referenceType }) => {
    let targetIds = userIds;
    if (isAllOfType) {
      const allUsers = await prisma.user.findMany({ select: { id: true } });
      targetIds = allUsers.map(u => u.id);
    }
    
    if (targetIds.length === 0) return { count: 0 };

    const dataPayload = targetIds.map(userId => ({
      userId, title, body, type, referenceId, referenceType
    }));

    const result = await prisma.customerNotification.createMany({ data: dataPayload });

    targetIds.forEach(userId => {
      emitNewNotification(`user_${userId}`, { title, body, type, referenceId, referenceType });
    });
    
    return { count: result.count };
  },

  /**
   * Gửi thông báo cho 1 nhóm Nhà hàng
   */
  pushToRestaurant: async ({ restaurantIds = [], isAllOfType, title, body, type, referenceId, referenceType }) => {
    let targetIds = restaurantIds;
    if (isAllOfType) {
      const allRes = await prisma.restaurant.findMany({ select: { id: true } });
      targetIds = allRes.map(r => r.id);
    }

    if (targetIds.length === 0) return { count: 0 };

    const dataPayload = targetIds.map(restaurantId => ({
      restaurantId, title, body, type, referenceId, referenceType
    }));

    const result = await prisma.restaurantNotification.createMany({ data: dataPayload });

    targetIds.forEach(restaurantId => {
      emitNewNotification(`restaurant_${restaurantId}`, { title, body, type, referenceId, referenceType });
    });
    
    return { count: result.count };
  },

  /**
   * Gửi thông báo cho 1 nhóm Thương hiệu
   */
  pushToBrand: async ({ brandIds = [], isAllOfType, title, body, type, referenceId, referenceType }) => {
    let targetIds = brandIds;
    if (isAllOfType) {
      const allBrands = await prisma.brand.findMany({ select: { id: true } });
      targetIds = allBrands.map(b => b.id);
    }

    if (targetIds.length === 0) return { count: 0 };

    const dataPayload = targetIds.map(brandId => ({
      brandId, title, body, type, referenceId, referenceType
    }));

    const result = await prisma.brandNotification.createMany({ data: dataPayload });

    targetIds.forEach(brandId => {
      emitNewNotification(`brand_${brandId}`, { title, body, type, referenceId, referenceType });
    });
    
    return { count: result.count };
  },

  /**
   * Gửi thông báo cho System Admin
   */
  pushToSystemAdmin: async ({ title, body, type, referenceId, referenceType }) => {
    const notification = await prisma.systemNotification.create({
      data: {
        title,
        body,
        type,
        referenceId,
        referenceType,
      },
    });

    emitNewNotification(`system_admin`, notification);
    return notification;
  },

  /**
   * (MỚI) Gửi thông báo cho TOÀN BỘ HỆ THỐNG (Fan-out)
   */
  pushToAll: async ({ title, body, type, referenceId, referenceType }) => {
    // 1. Lấy danh sách ID của tất cả thực thể
    const [users, restaurants, brands] = await Promise.all([
      prisma.user.findMany({ select: { id: true } }),
      prisma.restaurant.findMany({ select: { id: true } }),
      prisma.brand.findMany({ select: { id: true } })
    ]);

    // 2. Chạy Batch Insert (Tối ưu hiệu năng thay vì lặp từng người)
    const customerData = users.map(u => ({ userId: u.id, title, body, type, referenceId, referenceType }));
    const restaurantData = restaurants.map(r => ({ restaurantId: r.id, title, body, type, referenceId, referenceType }));
    const brandData = brands.map(b => ({ brandId: b.id, title, body, type, referenceId, referenceType }));
    
    await Promise.all([
      customerData.length > 0 && prisma.customerNotification.createMany({ data: customerData }),
      restaurantData.length > 0 && prisma.restaurantNotification.createMany({ data: restaurantData }),
      brandData.length > 0 && prisma.brandNotification.createMany({ data: brandData }),
      // Gửi luôn cho chính System Admin để lưu log hệ thống
      prisma.systemNotification.create({ data: { title, body, type, referenceId, referenceType } })
    ]);

    // 3. Emit Socket. Gửi sự kiện đặc biệt đến tất cả mọi người thay vì gửi vào room ảo
    emitGlobalNotification({ title, body, type, referenceId, referenceType });

    return { success: true, targets: { users: users.length, restaurants: restaurants.length, brands: brands.length } };
  },
};
