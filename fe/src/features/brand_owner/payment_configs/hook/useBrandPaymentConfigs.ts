import { useQuery } from "@tanstack/react-query";
import { getBrandPaymentConfigsService } from "../service/brand_payment.service";

export const useBrandPaymentConfigs = (brandId: string | undefined) => {
    return useQuery({
        queryKey: ["BRAND_PAYMENT_CONFIGS", brandId],
        queryFn: () => getBrandPaymentConfigsService(brandId!),
        enabled: Boolean(brandId),
        staleTime: 60 * 1000
    });
};
