import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllAsReadService, markAsReadService } from "../service/notification.service";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { NOTIFICATION_QUERY_KEY } from "./useGetNotifications";
import { NOTIFICATION_UNREAD_QUERY_KEY } from "./useGetUnreadCount";
import { GetNotificationsResponse } from "../type/notification.type";

export const useMarkAsRead = (workspaceTypeOverride?: string) => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useAuthStore();
  const workspaceType = workspaceTypeOverride || activeWorkspace.type;

  return useMutation({
    mutationFn: (notificationId: string) => markAsReadService(notificationId, workspaceType, activeWorkspace.id),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: [NOTIFICATION_QUERY_KEY] });
      const previousNotifications = queryClient.getQueriesData<GetNotificationsResponse>({ queryKey: [NOTIFICATION_QUERY_KEY] });

      queryClient.setQueriesData<GetNotificationsResponse>({ queryKey: [NOTIFICATION_QUERY_KEY] }, (old) => {
        if (!old || !old.metadata || !old.metadata.data) return old;
        return {
          ...old,
          metadata: {
            ...old.metadata,
            data: old.metadata.data.map((n: INotification) => n.id === notificationId ? { ...n, isRead: true } : n),
            unreadCount: Math.max(0, (old.metadata.unreadCount || 0) - 1)
          }
        };
      });

      return { previousNotifications };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          if (data) queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_UNREAD_QUERY_KEY] });
    }
  });
};

export const useMarkAllAsRead = (workspaceTypeOverride?: string) => {
  const queryClient = useQueryClient();
  const { activeWorkspace } = useAuthStore();
  const workspaceType = workspaceTypeOverride || activeWorkspace.type;

  return useMutation({
    mutationFn: () => markAllAsReadService(workspaceType, activeWorkspace.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [NOTIFICATION_QUERY_KEY] });
      const previousNotifications = queryClient.getQueriesData<GetNotificationsResponse>({ queryKey: [NOTIFICATION_QUERY_KEY] });

      queryClient.setQueriesData<GetNotificationsResponse>({ queryKey: [NOTIFICATION_QUERY_KEY] }, (old) => {
        if (!old || !old.metadata || !old.metadata.data) return old;
        return {
          ...old,
          metadata: {
            ...old.metadata,
            data: old.metadata.data.map((n: INotification) => ({ ...n, isRead: true })),
            unreadCount: 0
          }
        };
      });

      return { previousNotifications };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          if (data) queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_UNREAD_QUERY_KEY] });
    }
  });
};
