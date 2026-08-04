import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlansService } from "../service/my_brand_subscription_plans.get.service";

export const useGetSubscriptionPlans = () => {
    return useQuery({
        queryKey: ['subscriptionPlans'],
        queryFn: getSubscriptionPlansService,
        staleTime: 60 * 1000
    });
};
