import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInvoicesService, getSubscriptionPlansService, checkoutSubscriptionService } from '../service/billing.service';
import { toast } from 'sonner';

export const useGetInvoices = (brandId: string) => {
    return useQuery({
        queryKey: ['invoices', brandId],
        queryFn: () => getInvoicesService(brandId),
        enabled: !!brandId,
        staleTime: 60 * 1000, // 1 minute as per rule
    });
};

export const useGetSubscriptionPlans = (brandId: string) => {
    return useQuery({
        queryKey: ['subscriptionPlans', brandId],
        queryFn: () => getSubscriptionPlansService(brandId),
        enabled: !!brandId,
        staleTime: 60 * 1000,
    });
};

export const useCheckoutSubscription = (brandId: string) => {
    return useMutation({
        mutationFn: (planId: string) => checkoutSubscriptionService(brandId, planId),
        onSuccess: (response) => {
            const checkoutUrl = response.data?.metadata?.checkoutUrl;
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                toast.error("Không nhận được URL thanh toán");
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Lỗi khởi tạo thanh toán");
        }
    });
};
