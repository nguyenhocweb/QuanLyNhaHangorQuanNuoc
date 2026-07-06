import { getPasswordByID,UpdateUserById } from "../repository/index.js"
import {hashPass,comparePass } from "../../../../core/utils/bcrypt.js"
import {NotFoundError,AuthFailureError} from "../../../../core/constants/error/index.js"
export const ChangePasswordService=async({id,currentPassword,newPassword})=>{
      const pass=await getPasswordByID(id);
      if(!pass) {throw new NotFoundError("Không tìm thấy tài nguyên")}
      if(!pass.password||pass.providerId){return {mes:"Bạn đang đăng nhập bằng Google or Facebook"}}
      if(!(await comparePass(currentPassword,pass.password))){
          throw new AuthFailureError("Sai mật khẩu hiện tại")
      }
      // update mật khẩu mới
      const hash=await hashPass(newPassword)
      await UpdateUserById(id,{password:hash},{});
      return {mes:"Đã thay đổi mật khẩu thành công"}
}