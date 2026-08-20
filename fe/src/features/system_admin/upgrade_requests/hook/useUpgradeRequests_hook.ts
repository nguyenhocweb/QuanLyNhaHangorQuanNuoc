import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminUpgradeRequests, updateAdminUpgradeRequestStatus } from "../service/upgrade_request.service";
import toast from "react-hot-toast";

export const useAdminUpgradeRequests = (params: { page: number; limit: number; search?: string; status?: string }) => {
  return useQuery({
    queryKey: ["admin-upgrade-requests", params],
    queryFn: () => getAdminUpgradeRequests(params),
    staleTime: 60 * 1000,
  });
};

export const useUpdateAdminUpgradeRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, planId }: { id: string; status: "APPROVED" | "REJECTED"; planId?: string }) =>
      updateAdminUpgradeRequestStatus(id, status, planId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-upgrade-requests"] });
      toast.success(variables.status === "APPROVED" ? "Đã phê duyệt yêu cầu nâng cấp!" : "Đã từ chối yêu cầu nâng cấp!");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(message);
    },
  });
};
