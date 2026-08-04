import { useQuery } from '@tanstack/react-query';
import { getMyInvoicesService } from '../service/invoice.get.service';

interface UseGetMyInvoicesProps {
    page: number;
    limit: number;
}

export const useGetMyInvoices = ({ page, limit }: UseGetMyInvoicesProps) => {
    return useQuery({
        queryKey: ['CUSTOMER_INVOICES', { page, limit }],
        queryFn: () => getMyInvoicesService({ page, limit }),
        staleTime: 60 * 1000, // 1 minute
    });
};
