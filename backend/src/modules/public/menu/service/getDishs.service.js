import { getDishs,countDishs } from "../repository/index.js";
export const getDishsService=async(page,limit,where,type)=>{
    
    const baseWhere = {AND:[
        ...(Array.isArray(where) ? where : where ? [where] : []),
        { is_available: true },
    ]};
    const [Dishs,totalDishs]=await Promise.all([
        getDishs({
            page:page,
            limit:limit,
            where: baseWhere,
            type:type
        }),
        countDishs( baseWhere )
    ])
    console.log(Dishs);
    
     return Dishs?{code:200,data:{data:Dishs,total:totalDishs}}:{code:404,mes:"không tìm thấy tài nguyên"}
   
}