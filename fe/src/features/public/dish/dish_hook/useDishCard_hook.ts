import { useQuery } from "@tanstack/react-query";
import { DishCardHomeSevice } from "../dish_service/DishCardHome_service";
import { DishCardRequestType } from "../dish_type/card_dish_type";
export const useDishCard_hook = ({type,limit,page,search,id}:DishCardRequestType) => {
    return useQuery({
        queryKey: ["pageDish", {type,limit,page,search,id}],
        queryFn: () => DishCardHomeSevice({type,limit,page,search,id}),


        placeholderData: (prev) => prev, // 🔥 giữ data cũ khi đổi page
        staleTime: 1000 * 60,   // cache 1 phút hết 1 phút gọi lại lệnh mới gọi lại api
        //refetchInterval: 60 *1000, // mõi 1 phút tự động gọi api
        refetchOnWindowFocus: false, // đổi tab thì có gọi api lại không true có
    })
}