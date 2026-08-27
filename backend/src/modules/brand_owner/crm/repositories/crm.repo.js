import { prisma } from "../../../../databases/init.mongodb.js";

class BrandCrmRepo {
  async getBrandCustomerStats(brandId) {
    const customers = await prisma.restaurantCustomer.findMany({
      where: {
        restaurant: { brandId: brandId }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            sdt: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    return customers;
  }
}

export const brandCrmRepo = new BrandCrmRepo();
