import { getRestaurants,countRestauran } from "../repository.restaurant/index.js";
export const getRestaurantsService=async(page,limit,where)=>{
    const [restaurants,totalRestaurant]=await Promise.all([
        getRestaurants({
            page:page,
            limit:limit,
            where: {...where, isActive: "ACTIVE"}
        }),
        countRestauran( {...where, isActive: "ACTIVE"} )
    ])
     return restaurants?{code:200,data:{data:restaurants,total:totalRestaurant}}:{code:404,mes:"không tìm thấy tài nguyên"}
}