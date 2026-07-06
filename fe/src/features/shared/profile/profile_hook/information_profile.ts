import { toast } from 'sonner';
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from '@/src/core/lib/errorHandle';
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { updateProfileService } from "../profile_service/informationProfile_service";
export const useUpdateProfile = () => {
    const { updateUser } = useAuthStore();
    const mutation = useMutation({
        mutationFn: updateProfileService,
        onSuccess: (data) => {
            updateUser(data as any);
            toast.success("Cập nhật thông tin cá nhân thành công!");
        },
        onError: (error) => {
            const errorMessage = getErrorMessage(error);
            toast.error(` ${errorMessage}`);
        }

    });
    return mutation;
}