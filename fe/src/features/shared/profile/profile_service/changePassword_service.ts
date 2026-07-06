import axiosClient from "@/src/core/api/axios-instance";
import { ChangePasswordForm } from "../profile_schemas/changePassword_schemas";
export const changePasswordService=async(data:ChangePasswordForm):Promise<{mes:string}>=>{
      const result=await axiosClient.patch<{mes:string}>("/users/changePassword",data);
      return result.data
} 