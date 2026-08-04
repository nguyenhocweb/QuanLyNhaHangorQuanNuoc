import { useQuery } from '@tanstack/react-query';
import { getMyOrdersService } from '../service/order.get.service';

interface UseGetMyOrdersProps {
    page: number;
    limit: number;
    status?: string;
}

export const useGetMyOrders = ({ page, limit, status }: UseGetMyOrdersProps) => {
    return useQuery({
        queryKey: ['CUSTOMER_ORDERS', { page, limit, status }],
        queryFn: () => getMyOrdersService({ page, limit, status }),
        staleTime: 60 * 1000, // 1 minute
    });
};
