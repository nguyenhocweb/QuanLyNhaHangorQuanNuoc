import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    getPaymentMethodsService, 
    createPaymentMethodService, 
    updatePaymentMethodService, 
    deletePaymentMethodService 
} from "../service/payment_method_service";
import toast from "react-hot-toast";

export const usePaymentMethods = () => {
    return useQuery({
        queryKey: ["payment_methods"],
        queryFn: getPaymentMethodsService,
        staleTime: 60 * 1000,
    });
};

export const useCreatePaymentMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaymentMethodService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment_methods"] });
            toast.success("Tạo phương thức thanh toán thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi tạo phương thức thanh toán");
        }
    });
};

export const useUpdatePaymentMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePaymentMethodService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment_methods"] });
            toast.success("Cập nhật thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi cập nhật");
        }
    });
};

export const useDeletePaymentMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePaymentMethodService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment_methods"] });
            toast.success("Xóa thành công!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi xóa");
        }
    });
};
