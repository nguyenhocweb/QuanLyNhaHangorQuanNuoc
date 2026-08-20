import { brandCrmRepo } from "../repositories/crm.repo.js";
import { prisma } from "../../../../databases/init.mongodb.js";

class BrandCrmService {
  async getCustomerAnalytics(brandId) {
    const customers = await brandCrmRepo.getBrandCustomerStats(brandId);

    let newCount = 0;
    let memberCount = 0;
    let silverCount = 0;
    let goldCount = 0;
    let vipCount = 0;

    customers.forEach(c => {
      switch (c.tier) {
        case 'NEW': newCount++; break;
        case 'MEMBER': memberCount++; break;
        case 'SILVER': silverCount++; break;
        case 'GOLD': goldCount++; break;
        case 'VIP': vipCount++; break;
      }
    });

    return {
      totalCustomers: customers.length,
      tiers: {
        NEW: newCount,
        MEMBER: memberCount,
        SILVER: silverCount,
        GOLD: goldCount,
        VIP: vipCount
      },
      customersList: customers // Optional: Trả về danh sách để hiển thị table chi tiết nếu cần
    };
  }

  async getLoyaltyTransactions(brandId) {
    const transactions = await prisma.loyaltyTransaction.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
      take: 100 // Lấy 100 giao dịch gần nhất
    });
    return transactions;
  }
}

export const brandCrmService = new BrandCrmService();
