import { useQuery } from "@tanstack/react-query";
import { getPublicBrandByIdService } from "../brands_services/public_brand.service";

export const usePublicBrand_hook = (id: string) => {
    // Làm sạch id đề phòng có chuỗi ngoặc kép
    const cleanId = id?.replace(/['"]/g, '').trim();
    return useQuery({
        queryKey: ["public_brand", cleanId],
        queryFn: () => getPublicBrandByIdService(cleanId),
        enabled: !!cleanId,
        staleTime: 1000 * 60, // Cache 1 phút
        refetchOnWindowFocus: false,
    });
};
