import { prisma } from "../../../databases/init.mongodb.js";
export const getDishs=async(page,limit)=>{
       const result =await prisma.menuItem.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where:{
            is_available:true,
        },
        orderBy:[
            {is_featured:"desc"}, // món hot
            {createdAt:"desc"},// mới nhất
        ],
        select:{
            is_featured:true,
            description:true,
            id:true,
            name:true,
            base_price:true,
            image:true,
            restaurant:{
                select:{
                    name:true
                }
            }
        }
       }) ;
       console.log(result);
       
       return result?result.map(({restaurant,...e})=>({
        ...e,
        restaurantName:restaurant.name
       })):null
}