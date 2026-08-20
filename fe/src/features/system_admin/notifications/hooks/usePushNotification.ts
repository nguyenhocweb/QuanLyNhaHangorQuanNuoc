import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pushNotificationService } from "../service/notification.push.service";
import { PushNotificationValues } from "../schema/notification.push.schema";
import { toast } from "sonner";
import { NOTIFICATION_QUERY_KEY } from "@/src/features/public/notifications/hook/useGetNotifications";

export const usePushNotification = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PushNotificationValues) => pushNotificationService(payload),
    onSuccess: () => {
      toast.success("Gửi thông báo thành công!");
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEY] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi gửi thông báo");
    }
  });
};
