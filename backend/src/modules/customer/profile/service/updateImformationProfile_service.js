import { UpdateUserById } from "../repository/index.js"
import { NotFoundError } from "../../../../core/constants/error/index.js";
export const updateInformationProfileService=async(data)=>{
      const {id,...user}=data
      const select={
            name:true,
            gender:true,
            date_of_birth:true
      }
      const updateUser=await UpdateUserById(id,user,select);
      if (!updateUser) throw new NotFoundError("Không tìm thấy tài nguyên");
      return updateUser
      
}