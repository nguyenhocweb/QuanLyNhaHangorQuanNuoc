import { getErrorMessage } from "@/src/core/lib/errorHandle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateBrandService } from "../brands_services/Brand_service";
import { updateBrandImagesService } from "../brands_services/CreateBrand_service";
import { uploadFileToCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/UpdateCloudinary";
import { CloudinarySignatureService } from "@/src/features/shared/cloudinary/cloudinary_service/cloudinarySignature_service";

export const useUpdateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string, payload: any, FileLogo?: File, FileImageMain?: File, FileImages?: File[], existingImages?: string[] }) => {
            const { id, payload, FileLogo, FileImageMain, FileImages, existingImages } = data;
            
            // Cập nhật thông tin cơ bản
            await updateBrandService(id, payload);
            
            const uploadTasks: Promise<string>[] = [];
            const uploadKeys: Array<"logo" | "imageMain"> = [];

            if (FileLogo) {
                uploadKeys.push("logo");
                const sigData = await CloudinarySignatureService({
                    folder: `quan_ly_nha_hang/brands/${id}/logo`,
                    public_id: "1"
                });
                uploadTasks.push(uploadFileToCloudinary(sigData, FileLogo));
            }

            if (FileImageMain) {
                uploadKeys.push("imageMain");
                const sigData = await CloudinarySignatureService({
                    folder: `quan_ly_nha_hang/brands/${id}/imageMain`,
                    public_id: "1"
                });
                uploadTasks.push(uploadFileToCloudinary(sigData, FileImageMain));
            }

            let otherImageTasks: Promise<string>[] = [];
            if (FileImages && FileImages.length > 0) {
                otherImageTasks = FileImages.map(async (file: File, index: number) => {
                    const sigData = await CloudinarySignatureService({
                        folder: `quan_ly_nha_hang/brands/${id}/images`,
                        public_id: `${Date.now()}_${index}`
                    });
                    return uploadFileToCloudinary(sigData, file);
                });
            }

            const updatePayload: Record<string, any> = {};

            if (uploadTasks.length > 0) {
                const uploadResults = await Promise.all(uploadTasks);
                uploadResults.forEach((url, index) => {
                    updatePayload[uploadKeys[index]] = url;
                });
            }

            if (otherImageTasks.length > 0 || (existingImages && existingImages.length > 0)) {
                const otherImagesResults = await Promise.all(otherImageTasks);
                updatePayload.images = [...(existingImages || []), ...otherImagesResults];
            }

            if (Object.keys(updatePayload).length > 0) {
                await updateBrandImagesService(id, updatePayload as any);
            }
        },
        onSuccess: () => {
            toast.success("Cập nhật thương hiệu thành công!");
            queryClient.invalidateQueries({ queryKey: ["brandPage"] });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error) || "Cập nhật thất bại");
        }
    });
};
