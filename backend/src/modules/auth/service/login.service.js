import { comparePass } from "../../../core/utils/bcrypt.js";
import { getUser } from "../repositories/User.db.js";
import {createTokenAccess,createTokenRefresh} from "../../../core/utils/authUtils.js"

export const LoginService = async ({ user_name, passwordfe }) => {

  const result = await getUser({
    OR: [
      { user_name: user_name },
      { email: user_name }
    ]
  });
  if (!result) return { code: 404, mes: "Tên đăng nhập không đúng" }
  const { is_active, password, ...User } = result
  if (!(await comparePass(passwordfe, password))) return { code: 404, mes: "Mật khẩu sai" }
  const unActive = {
    PENDING: "Đang chờ xác minh",
    INACTIVE: " Tạm khóa một thời gian",
    BANNED: " Cấm vĩnh viễn (Vi phạm)"
  }
  if (unActive[is_active]) return { code: 403, mes: unActive[is_active] }
  
  return { 
    code: 200, 
    data: User ,
    token:{
      accessToken:createTokenAccess(
        {
          id:User.id,
          role:User.role,
          employmentType:User.brand?"BRAND":(User.restaurant?"RESTAURANT":NULL),
          permissions:User.permissions??null
        }
      ),
      refreshToken:createTokenRefresh({
         id:User.id,
          role:User.role,
          employmentType:User.brand?"BRAND":(User.restaurant?"RESTAURANT":NULL),
          permissions:User.permissions??null
      })
    }
  }
}