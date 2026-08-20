
import { prisma } from "../../../databases/init.mongodb.js";
export const getPermission=async(where)=>{
    return prisma.permission_vs_Employment.findMany({
        where:where,
        include:{
            select:{
                name:true,
                type:true,
            }
        }
    })
}