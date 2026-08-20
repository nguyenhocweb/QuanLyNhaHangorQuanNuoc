import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
    getPaymentMethodsService, 
    createPaymentMethodService, 
    updatePaymentMethodService, 
    deletePaymentMethodService,
    getAdminPaymentConfigService,
    upsertAdminPaymentConfigService
} from "../service/payment.service";

export const PAYMENT_KEYS = {
    all: ['payment_methods'] as const,
    config: (id: string) => ['payment_config', id] as const,
};

export const usePaymentMethods = () => {
    return useQuery({
        queryKey: PAYMENT_KEYS.all,
        queryFn: getPaymentMethodsService,
        staleTime: 60 * 1000,
    });
};

export const useCreatePaymentMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaymentMethodService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all });
            toast.success("Thêm phương thức thanh toán thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm mới");
        }
    });
};

export const useUpdatePaymentMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updatePaymentMethodService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all });
            toast.success("Cập nhật thông tin thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
        }
    });
};

export const useDeletePaymentMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePaymentMethodService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all });
            toast.success("Xóa phương thức thanh toán thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa");
        }
    });
};

// Config Hooks
export const usePaymentConfig = (systemPaymentMethodId: string | undefined) => {
    return useQuery({
        queryKey: PAYMENT_KEYS.config(systemPaymentMethodId!),
        queryFn: () => getAdminPaymentConfigService(systemPaymentMethodId!),
        enabled: !!systemPaymentMethodId,
        staleTime: 60 * 1000,
    });
};

export const useUpsertPaymentConfig = (systemPaymentMethodId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => upsertAdminPaymentConfigService(systemPaymentMethodId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.config(systemPaymentMethodId) });
            toast.success("Lưu cấu hình kết nối API thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi lưu cấu hình");
        }
    });
};
