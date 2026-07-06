import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubscriptionService, createSubscriptionService, updateSubscriptionService, deleteSubscriptionService, getSubscriptionFeaturesService } from "../service/subscription_service";
import toast from "react-hot-toast";

export const useGetSubscriptionFeatures = () => {
    return useQuery({
        queryKey: ["subscription_features"],
        queryFn: getSubscriptionFeaturesService
    });
};

export const useGetSubscriptions = (params?: { page?: number, limit?: number, search?: string, status?: string }) => {
    return useQuery({
        queryKey: ["subscriptions", params],
        queryFn: () => getSubscriptionService(params)
    });
};

export const useCreateSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubscriptionService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
            toast.success("Thêm gói cước thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
        }
    });
};

export const useUpdateSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSubscriptionService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
            toast.success("Cập nhật gói cước thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
        }
    });
};

export const useDeleteSubscription = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSubscriptionService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
            toast.success("Xóa gói cước thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
        }
    });
};
