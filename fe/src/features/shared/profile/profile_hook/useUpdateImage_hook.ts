import { toast } from 'sonner';
import { UpdateImageService } from "../profile_service/UpdateImage_service";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/src/core/lib/errorHandle";
import { useUpdateCloudinary } from '@/src/features/shared/cloudinary/cloudinary_hook/useUpdateCloudinary';
import { FileUploadItem } from '@/src/features/shared/cloudinary/cloudinary_type/CloudinarySignature_type';
export const useUpdateImage = () => {
    const { updateUser } = useAuthStore();
    const {mutateAsync:updateCloudinary}=useUpdateCloudinary()
    return useMutation({
        mutationFn: async({public_idfe,file,folder}:FileUploadItem)=>{
          const imageUrl = await updateCloudinary({ folder, file, public_idfe });
          const dbResponse = await UpdateImageService({ urlAvatar: imageUrl, id: public_idfe });

            // --- BƯỚC 3: Trả về kết quả ---
            // Kết quả này sẽ tự động chảy xuống biến 'data' ở hàm onSuccess bên dưới
            return dbResponse;
        },
        onSuccess: (data) => {
            updateUser({ avatar: data.avatar });
            toast.success("Cập nhật ảnh đại diện thành công!");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        }
    })
}