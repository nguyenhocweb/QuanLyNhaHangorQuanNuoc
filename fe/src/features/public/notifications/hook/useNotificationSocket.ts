import { useEffect } from "react";
import { useSocket } from "@/src/core/hooks/useSocket";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { NOTIFICATION_QUERY_KEY } from "./useGetNotifications";
import { toast } from "sonner";
import { INotification } from "../type/notification.type";

export const useNotificationSocket = () => {
  const { activeWorkspace } = useAuthStore();
  const { socket, isConnected } = useSocket(activeWorkspace.restaurantId);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join đúng workspace channel cho B2B
    if (activeWorkspace.type !== "CUSTOMER") {
      socket.emit("join_workspace", {
        restaurantId: activeWorkspace.restaurantId,
        brandId: activeWorkspace.brandId,
        isSystemAdmin: activeWorkspace.type === "SYSTEM"
      });
    }

    // Lắng nghe sự kiện new_notification
    const handleNewNotification = (notification: INotification) => {
      // 1. Hiển thị Toast (với âm thanh nếu cần)
      toast(notification.title, {
        description: notification.body,
        position: "bottom-right",
      });

      // 2. Cập nhật Cache thay vì gọi lại API
      // Lấy query key hiện tại
      const queryKey = [
        NOTIFICATION_QUERY_KEY, 
        activeWorkspace.type, 
        activeWorkspace.restaurantId, 
        activeWorkspace.brandId,
        1, // Update trang 1
        20 // Limit
      ];

      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          metadata: {
            ...oldData.metadata,
            data: [notification, ...oldData.metadata.data],
            total: oldData.metadata.total + 1,
            unreadCount: oldData.metadata.unreadCount + 1
          }
        };
      });
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket, isConnected, activeWorkspace, queryClient]);
};
