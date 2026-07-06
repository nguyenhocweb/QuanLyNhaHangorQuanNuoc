import { useQuery } from "@tanstack/react-query";
import { BrandService } from "../brands_services/Brand_service";

export const useBrand_hook = (id:string) => {
    // Làm sạch cái id (đề phòng dính cái chuỗi ngoặc kép '""' từ URL)
    const cleanId = id?.replace(/['"]/g, '').trim();
    return useQuery({
        queryKey: ["brand", cleanId],
        queryFn: () => BrandService(cleanId),
        enabled: !!cleanId, // Chỉ chạy query khi cleanId có giá trị hợp lệ
        placeholderData: (prev) => prev, // 🔥 giữ data cũ khi đổi page or đổi trang
        staleTime: 1000 * 60,   // cache 1 phút hết 1 phút gọi lại lệnh mới gọi lại api
        refetchOnWindowFocus: false, // đổi tab thì có gọi api lại không . true có gọi lại
    })
}