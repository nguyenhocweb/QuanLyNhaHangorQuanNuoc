import { crmRepo } from "../repositories/crm.repo.js";

class CrmService {
  async getCustomerAnalytics(restaurantId) {
    const customers = await crmRepo.getRestaurantCustomerStats(restaurantId);

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
      }
    };
  }
}

export const crmService = new CrmService();
