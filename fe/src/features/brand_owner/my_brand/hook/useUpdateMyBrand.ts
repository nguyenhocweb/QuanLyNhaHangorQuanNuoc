import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyBrandService } from "../service/my_brand.update.service";
import { toast } from "sonner";
import { uploadFileToCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/UpdateCloudinary";
import { CloudinarySignatureService } from "@/src/features/shared/cloudinary/cloudinary_service/cloudinarySignature_service";

export const useUpdateMyBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ payload, FileLogo, FileImageMain }: { payload: any, FileLogo?: File, FileImageMain?: File }) => {
            let logoUrl = payload.logo;
            let imageMainUrl = payload.imageMain;

            if (FileLogo) {
                const sigData = await CloudinarySignatureService({
                    folder: `quan_ly_nha_hang/brands`,
                    public_id: "logo_" + Date.now()
                });
                logoUrl = await uploadFileToCloudinary(sigData, FileLogo);
            }

            if (FileImageMain) {
                const sigData = await CloudinarySignatureService({
                    folder: `quan_ly_nha_hang/brands`,
                    public_id: "imageMain_" + Date.now()
                });
                imageMainUrl = await uploadFileToCloudinary(sigData, FileImageMain);
            }

            const updatedPayload = {
                ...payload,
                logo: logoUrl,
                imageMain: imageMainUrl
            };

            const res = await updateMyBrandService(updatedPayload);
            return res;
        },
        onSuccess: (data) => {
            toast.success("Cập nhật thương hiệu thành công");
            queryClient.invalidateQueries({ queryKey: ["myBrand"] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Lỗi khi cập nhật thương hiệu");
        }
    });
};
