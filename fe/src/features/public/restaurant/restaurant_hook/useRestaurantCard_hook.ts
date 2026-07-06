import { useQuery } from "@tanstack/react-query";
import { RestaurantCardService } from "../restaurant_services/RestaurantCard_service";
import { RestaurantCardRequestType } from "../restaurant_type/restaurant_card_type";
export const useRestaurandCard=({page,limit,search,city,id,categoryRestaurant,review}:RestaurantCardRequestType)=>{
    return useQuery({
        queryKey:["restaurantCard",{page,limit,search,city,id,categoryRestaurant,review}],
        queryFn:()=>RestaurantCardService({page:page,limit:limit,search:search,city:city,id:id,categoryRestaurant:categoryRestaurant,review:review}),
        placeholderData:(pev)=>pev,
         staleTime: 1000 * 60,   // cache 1 phút hết 1 phút gọi lại lệnh mới gọi lại api
        //refetchInterval: 60 *1000, // mõi 1 phút tự động gọi api
        refetchOnWindowFocus: false, // đổi tab thì có gọi api lại không true có
    })
}