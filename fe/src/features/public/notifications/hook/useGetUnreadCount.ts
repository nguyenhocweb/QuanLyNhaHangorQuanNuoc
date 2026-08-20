import { useQuery } from "@tanstack/react-query";
import { getUnreadCountService } from "../service/notification.service";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

export const NOTIFICATION_UNREAD_QUERY_KEY = "notification_unread_count";

export const useGetUnreadCount = (workspaceTypeOverride?: string) => {
  const { activeWorkspace } = useAuthStore();
  const workspaceType = workspaceTypeOverride || activeWorkspace.type;

  return useQuery({
    queryKey: [NOTIFICATION_UNREAD_QUERY_KEY, workspaceType, activeWorkspace.id],
    queryFn: () => getUnreadCountService(workspaceType, activeWorkspace.id),
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000, // Tự động refetch mỗi 30s để đảm bảo badge realtime nếu không có socket
    enabled: !!workspaceType,
  });
};
