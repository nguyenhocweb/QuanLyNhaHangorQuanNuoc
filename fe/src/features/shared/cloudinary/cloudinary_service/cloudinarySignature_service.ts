import { CloudinarySignature_Request, CloudinarySignatureResponse } from './../cloudinary_type/CloudinarySignature_type';

import axiosClient from '@/src/core/api/axios-instance';
export const CloudinarySignatureService = async ({ folder, public_id }: CloudinarySignature_Request): Promise<CloudinarySignatureResponse> => {
       const response = await axiosClient.get<CloudinarySignatureResponse>(`/cloudinary/image?folder=${folder}&public_id=${public_id}`);
       return response.data
}
