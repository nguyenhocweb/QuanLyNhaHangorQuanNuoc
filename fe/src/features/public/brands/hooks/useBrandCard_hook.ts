import { useQuery } from "@tanstack/react-query";
import { BrandCardSevice } from "../services/BrandCard_service";
import { BrandCardRequestType } from "../types/brand-card-type";
export const useBrandCard_hook = ({page,limit,search,city,isFeatured,isNew}:BrandCardRequestType) => {
    return useQuery({
        queryKey: ["brandPage", {page,limit,search,city,isFeatured,isNew}],
        queryFn: () => BrandCardSevice({page,limit,search,city,isFeatured,isNew}),


        placeholderData: (prev) => prev, // 🔥 giữ data cũ khi đổi page
        staleTime: 1000 * 60,   // cache 1 phút hết 1 phút gọi lại lệnh mới gọi lại api
        //refetchInterval: 60 *1000, // mõi 1 phút tự động gọi api
        refetchOnWindowFocus: false, // đổi tab thì có gọi api lại không true có
    })
}