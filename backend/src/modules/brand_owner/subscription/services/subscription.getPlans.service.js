import { prisma } from "../../../../databases/init.mongodb.js";

class GetPlansService {
    async getActivePlans() {
        return await prisma.subscriptionPlan.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                price: 'asc'
            }
        });
    }
}

export const getPlansService = new GetPlansService();
