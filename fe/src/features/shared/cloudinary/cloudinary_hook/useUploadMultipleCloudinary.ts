import { CloudinarySignatureBulk_Request } from './../cloudinary_type/CloudinarySignatureBulk_type';
import { useMutation } from "@tanstack/react-query";
import { CloudinarySignatureBulkService } from "../cloudinary_service/cloudinarySignatureBulk_service";
import { getErrorMessage } from '@/src/core/lib/errorHandle';
import { toast } from 'sonner';
import axios from 'axios';

// 1. TẠO TYPE MỚI CHUẨN XÁC HƠN
import { MultipleUploadParams } from './../cloudinary_type/CloudinarySignatureBulk_type';

export const useUploadMultipleCloudinary = () => {
    return useMutation({
        mutationFn: async ({ items, folder }: MultipleUploadParams) => { 
            
            if (!items || items.length === 0) {
                throw new Error("Vui lòng chọn ít nhất một file!");
            }

            // 2. Lấy ra mảng CHỈ CHỨA TÊN FILE để gửi lên BE xin chữ ký
            const public_ids = items.map(item => item.public_id);

            // 3. Gọi Backend xin chữ ký
            const requestPayload: CloudinarySignatureBulk_Request = {
                folder: `/quan_ly_nha_hang${folder}`,
                public_ids: public_ids,
            };

            const signaturesArray = await CloudinarySignatureBulkService(requestPayload);

            // 4. Đóng gói FormData và Upload
            const uploadPromises = signaturesArray.map(async (sigItem, index) => {
                const formData = new FormData();
                // Lấy file vật lý từ mảng items ban đầu
                formData.append("file", items[index].file); 
                formData.append("api_key", sigItem.apiKey);
                formData.append("timestamp", sigItem.timestamp.toString());
                formData.append("signature", sigItem.signature);
                formData.append("folder", sigItem.folder);
                
                // Chuyền public_id chính xác vào FormData
                formData.append("public_id", sigItem.public_id);

                if (sigItem.transformation) {
                    formData.append("transformation", sigItem.transformation);
                }

                const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigItem.cloudName}/image/upload`;

                return axios.post(cloudinaryUrl, formData);
            });

            // 5. Chờ kết quả
            const uploadResults = await Promise.all(uploadPromises);
            const secureUrls = uploadResults.map((res) => res.data.secure_url);

            return secureUrls; 
        },

        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            toast.error(` ${errorMessage}`);
        },
    });
};