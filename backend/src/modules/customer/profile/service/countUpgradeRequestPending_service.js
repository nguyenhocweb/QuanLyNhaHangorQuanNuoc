import { countUpgradeRequest } from "../repository/index.js"
export const countUpgradeRequestPendingService=async()=>{
     const result=await countUpgradeRequest({
        status:"PENDING"
     })
     return result
}