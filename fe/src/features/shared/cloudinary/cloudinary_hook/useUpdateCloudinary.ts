import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { CloudinarySignatureService } from "../cloudinary_service/cloudinarySignature_service";
import axios from "axios";
import { getErrorMessage } from "@/src/core/lib/errorHandle";

import { FileUploadItem } from "../cloudinary_type/CloudinarySignature_type";
export const useUpdateCloudinary = () => {
    return useMutation({
        // mutationFn: Chứa toàn bộ logic xử lý bất đồng bộ
        mutationFn: async ({ public_idfe, folder ,file}: FileUploadItem) => {


            // 2. Gọi Backend xin chữ ký
            // Lưu ý: Đảm bảo CloudinarySignatureService của bạn trả về đúng object data
            const sigData = await CloudinarySignatureService({
                folder: `/quan_ly_nha_hang${folder}`,
                public_id: public_idfe,
            });
            const { signature, timestamp, public_id, apiKey, cloudName, transformation } = sigData;
            // 3. Đóng gói FormData
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", apiKey);
            formData.append("timestamp", timestamp.toString());
            formData.append("signature", signature);
            formData.append("folder", `/quan_ly_nha_hang${folder}`);
            formData.append("public_id", public_id);
            // ĐỪNG QUÊN: Nếu Backend đã ký transformation thì Frontend bắt buộc phải gửi kèm
            if (transformation) {
                formData.append("transformation", transformation);
            }

            // 4. Bắn thẳng lên Cloudinary
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            const uploadRes = await axios.post(cloudinaryUrl, formData);

            // Trả về URL an toàn để dùng ở bước tiếp theo
            return uploadRes.data.secure_url as string;
        },

        // khi gọi hàm gọi lun hàm sử lý thành công để sử lý update

        // Xử lý khi thất bại
        onError: (error: any) => {
            const errorMessage = getErrorMessage(error);
            toast.error(` ${errorMessage}`);
        },
    });
}