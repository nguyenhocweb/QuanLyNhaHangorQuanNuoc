import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMyBrandSubscriptionService } from "../service/my_brand_subscription.get.service";
import { useSocket } from "@/src/core/hooks/useSocket";

export const useGetMyBrandSubscription = (enabled: boolean = true) => {
    const queryClient = useQueryClient();
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleUpdate = () => {
            queryClient.invalidateQueries({ queryKey: ["myBrandSubscription"] });
        };

        socket.on("brand_subscription_updated", handleUpdate);

        return () => {
            socket.off("brand_subscription_updated", handleUpdate);
        };
    }, [socket, isConnected, queryClient]);

    return useQuery({
        queryKey: ["myBrandSubscription"],
        queryFn: async () => {
            const res = await getMyBrandSubscriptionService();
            return res.data.data;
        },
        staleTime: 60 * 1000,
        enabled,
    });
};
