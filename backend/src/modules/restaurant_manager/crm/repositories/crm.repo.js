import { prisma } from "../../../../databases/init.mongodb.js";

class CrmRepo {
  async getRestaurantCustomerStats(restaurantId) {
    const customers = await prisma.restaurantCustomer.findMany({
      where: { restaurantId }
    });

    return customers;
  }
}

export const crmRepo = new CrmRepo();
