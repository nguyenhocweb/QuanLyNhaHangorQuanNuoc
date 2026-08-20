import {prisma} from "../databases/init.mongodb.js";
//update trạng thái new quá 1 ngày thì hết mới
export const RestaurantJob=async()=>{
    const oneDaysAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    return await prisma.restaurant.updateMany({
        where:{
            createdAt: { lt: oneDaysAgo },
            isNew:true
        },
        data:{
            isNew:false
        }
    })
} 