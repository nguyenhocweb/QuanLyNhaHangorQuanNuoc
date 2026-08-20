import { useQuery } from "@tanstack/react-query";
import { getNotificationsService } from "../service/notification.service";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

export const NOTIFICATION_QUERY_KEY = "notifications";

export const useGetNotifications = (page: number = 1, limit: number = 20, type?: string, workspaceTypeOverride?: string) => {
  const { activeWorkspace, isAuthenticated } = useAuthStore();

  const resolvedWorkspaceType = workspaceTypeOverride || activeWorkspace.type;

  return useQuery({
    queryKey: [NOTIFICATION_QUERY_KEY, resolvedWorkspaceType, activeWorkspace.id, page, limit, type],
    queryFn: () => getNotificationsService({
      workspaceType: resolvedWorkspaceType,
      workspaceId: activeWorkspace.id,
      type,
      page,
      limit
    }),
    enabled: isAuthenticated && !!activeWorkspace.type,
    staleTime: 60 * 1000,
  });
};
