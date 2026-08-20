import { prisma } from "../../../../databases/init.mongodb.js"
export const getRole=async(where)=> {
    return await prisma.systemRole.findFirst({
        where,
        select:{
            id:true,
            name:true
        }
    })

}