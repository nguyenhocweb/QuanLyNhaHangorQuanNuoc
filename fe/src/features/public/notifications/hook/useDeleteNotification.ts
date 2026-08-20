import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotificationService } from "../service/notification.service";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { NOTIFICATION_QUERY_KEY } from "./useGetNotifications";
import { NOTIFICATION_UNREAD_QUERY_KEY } from "./useGetUnreadCount";
import { toast } from "sonner";
import { GetNotificationsResponse } from "../type/notification.type";

export const useDeleteNotification = (workspaceTypeOverride?: string) => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useAuthStore();
  const workspaceType = workspaceTypeOverride || activeWorkspace.type;

  return useMutation({
    mutationFn: (notificationId: string) => deleteNotificationService(notificationId, workspaceType, activeWorkspace.id),
    onMutate: async (notificationId) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: [NOTIFICATION_QUERY_KEY] });

      const previousNotifications = queryClient.getQueriesData<GetNotificationsResponse>({ queryKey: [NOTIFICATION_QUERY_KEY] });

      // Cập nhật lại cache hiện tại để ẩn notification bị xóa
      queryClient.setQueriesData<GetNotificationsResponse>({ queryKey: [NOTIFICATION_QUERY_KEY] }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.filter((n) => n.id !== notificationId),
          total: old.total - 1
        };
      });

      return { previousNotifications };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, data);
          }
        });
      }
      toast.error("Xóa thông báo thất bại!");
    },
    onSuccess: () => {
      // Invalidate để cập nhật lại badge unread
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_UNREAD_QUERY_KEY] });
      toast.success("Đã xóa thông báo");
    }
  });
};
