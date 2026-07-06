
import { getErrorMessage } from "@/src/core/lib/errorHandle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { CreateBrandFormValues } from "../brands_schemas/CreateBrand_Schemas";
import { createBrandBasicService, updateBrandImagesService } from "../brands_services/CreateBrand_service";
import { CreateBrandRequest } from "../brands_type/createBrandReponse_type";
import { uploadFileToCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/UpdateCloudinary";
import { CloudinarySignatureService } from "@/src/features/shared/cloudinary/cloudinary_service/cloudinarySignature_service";

export const useCreateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateBrandFormValues) => {
            const { FileLogo, FileImageMain, ...payload } = data;
            
            const brand = await createBrandBasicService(
                payload as unknown as CreateBrandRequest
            );
            
            const uploadTasks: Promise<string>[] = [];
            const uploadKeys: Array<"logo" | "imageMain"> = [];

            if (FileLogo) {
                uploadKeys.push("logo");
                // Xin chữ ký từ BE
                const sigData = await CloudinarySignatureService({
                    folder: `quan_ly_nha_hang/brands/${brand.id}/logo`,
                    public_id: "1"
                });
                uploadTasks.push(uploadFileToCloudinary(sigData, FileLogo));
            }

            if (FileImageMain) {
                uploadKeys.push("imageMain");
                // Xin chữ ký từ BE
                const sigData = await CloudinarySignatureService({
                    folder: `quan_ly_nha_hang/brands/${brand.id}/imageMain`,
                    public_id: "1"
                });
                uploadTasks.push(uploadFileToCloudinary(sigData, FileImageMain));
            }

            const updatePayload: Record<string, string> = {};

            if (uploadTasks.length > 0) {
                const uploadResults = await Promise.all(uploadTasks);
                uploadResults.forEach((url, index) => {
                    updatePayload[uploadKeys[index]] = url;
                });

                await updateBrandImagesService(brand.id, updatePayload as any);
            }

            return ;
        },
        onSuccess: () => {
            toast.success("Tạo thương hiệu thành công");
            queryClient.invalidateQueries({ queryKey: ["brandPage"] });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};
