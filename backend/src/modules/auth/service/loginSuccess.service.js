import {getUser} from "../repositories/User.db.js";
export const LoginSuccessService=async(id)=>{
     console.log("id:login Success Service: ",id);
     const result =await getUser({id:id});
     if(!result) return {code:404,mes:"không tìm thấy tài nguyên"}
     const {password,is_active,...user}=result;
      return {code:200,data:user}
}