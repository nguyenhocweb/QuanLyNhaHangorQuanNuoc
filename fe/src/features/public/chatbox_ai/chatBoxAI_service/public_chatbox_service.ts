import axiosClient from "@/src/core/api/axios-instance";

export const publicChatBoxAiSevice=async (mes:any,question:string):Promise<string>=>{
    const response=await axiosClient.post<string>("/ai/chat",{message:mes,question:question})    
    return response.data;
} 