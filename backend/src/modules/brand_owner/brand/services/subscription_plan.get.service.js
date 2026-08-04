import { getSubscriptionPlans } from "../repositories/subscription_plan.get.repo.js";

export const getSubscriptionPlansService = async () => {
    return await getSubscriptionPlans();
};
