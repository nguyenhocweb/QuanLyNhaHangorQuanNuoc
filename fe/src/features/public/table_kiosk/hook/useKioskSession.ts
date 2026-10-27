import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getKioskSessionService } from "../service/kiosk.session.service";
import { useEffect } from "react";
import io from "socket.io-client";

export const useKioskSession = (restaurantId: string, tableId: string) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['kiosk-session', restaurantId, tableId],
        queryFn: () => getKioskSessionService(restaurantId, tableId),
        enabled: !!restaurantId && !!tableId,
        staleTime: 10 * 1000,
        refetchInterval: 15 * 1000
    });

    useEffect(() => {
        if (!restaurantId || !tableId) return;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
        const socket = io(socketUrl, { withCredentials: true });

        socket.on("connect", () => {
            socket.emit("join_restaurant", restaurantId);
        });

        const handleInvalidate = () => {
            queryClient.invalidateQueries({ queryKey: ['kiosk-session', restaurantId, tableId] });
        };

        socket.on("table_updated", handleInvalidate);
        socket.on("order_updated", handleInvalidate);
        socket.on("reservation_updated", handleInvalidate);
        socket.on("table_session_updated", handleInvalidate);
        socket.on("table_order_updated", handleInvalidate);

        return () => {
            socket.off("table_updated", handleInvalidate);
            socket.off("order_updated", handleInvalidate);
            socket.off("reservation_updated", handleInvalidate);
            socket.off("table_session_updated", handleInvalidate);
            socket.off("table_order_updated", handleInvalidate);
            socket.disconnect();
        };
    }, [restaurantId, tableId, queryClient]);

    return query;
};
