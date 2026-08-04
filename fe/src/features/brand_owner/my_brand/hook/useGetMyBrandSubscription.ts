import { useQuery } from "@tanstack/react-query";
import { getMyBrandSubscriptionService } from "../service/my_brand_subscription.get.service";

export const useGetMyBrandSubscription = () => {
    return useQuery({
        queryKey: ["myBrandSubscription"],
        queryFn: async () => {
            const res = await getMyBrandSubscriptionService();
            return res.data.data;
        },
        staleTime: 60 * 1000,
    });
};
