

import { loginForm } from "../auth_schemas/login_schemas";
type LoginResponse = {
   id: string,
   name?: string,
   user_name: string,
   email: string,
   sdt?: string,
   avatar?: string,
   gender?: "NAM" | "NU" | "KHAC",
   date_of_birth?: Date,
   address?: string,
   role: "Khách hàng"|"Admin"|"Quản lý thương hiệu"|"Quản lý nhà hàng"|"Nhân viên",
   brand?: {
      id:string
      name:string,
      isSelect:boolean
   }[],
   restaurant?: {
      id:string
      name:string,
      isSelect:boolean
   }[],
   permissions?:string[],
   createdAt: Date,
   updatedAt: Date
}
interface User extends LoginResponse { };
export { type loginForm, type LoginResponse, type User }