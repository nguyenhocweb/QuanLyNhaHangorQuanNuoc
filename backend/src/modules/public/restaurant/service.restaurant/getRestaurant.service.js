import { getRestaurantById } from "../repository.restaurant/index.js";
export const getRestaurantService= async(id)=>{
     const result =await getRestaurantById(id);
     return result?{code:200,data:result}:{code:404,mes:"không tìm thấy tài nguyên"}
     
     
}