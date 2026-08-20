import { getDishs } from "../repository/index.js";
export const getDishsService=async(page,limit)=>{
    const result=await getDishs(page,limit);
    return result?{code:200,data:result}:{code:404,mes:"Không tìm thấy tài nguyên"}
}