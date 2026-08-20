import { prisma } from "../../../databases/init.mongodb.js"
export const getRole=async(where)=> {
    return await prisma.role.findFirst({
        where,
        select:{
            id:true,
            name:true
        }
    })

}