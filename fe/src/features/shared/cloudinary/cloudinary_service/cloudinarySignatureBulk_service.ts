import { CloudinarySignatureBulk_Request, CloudinarySignatureBulkResponse } from './../cloudinary_type/CloudinarySignatureBulk_type';

import axiosClient from '@/src/core/api/axios-instance';
export const CloudinarySignatureBulkService=async({folder,public_ids}:CloudinarySignatureBulk_Request):Promise<CloudinarySignatureBulkResponse[]>=>{
    const params= new URLSearchParams()
    params.append("folder",folder)
    public_ids.forEach(e=>{params.append("public_ids", e);})
       const response=await axiosClient.get<CloudinarySignatureBulkResponse[]>(`/cloudinary/image?${params.toString()}`);
       return response.data     
}