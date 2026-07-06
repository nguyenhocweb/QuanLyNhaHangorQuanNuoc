"use client"
import { Div, P, H, Button } from "@/src/core/components/ui";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useRef, useState } from "react";
import { useUpdateImage } from "@/src/features/shared/profile/profile_hook/useUpdateImage_hook"
const AvatarProfile = () => {
    const { user } = useAuthStore();

    const { mutate: updateImage } = useUpdateImage()
    // 1. Tạo một biến lưu trữ file đã chọn
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    // 1. Tạo một tham chiếu cho thẻ input
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        // 2. Khi click Button, kích hoạt click cho Input
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {

            const objectUrl = URL.createObjectURL(file);
            setSelectedFile(objectUrl);

            // Xử lý lấy chữ ký của cloudinary
            updateImage({file:file,folder:"/user/avatar",public_idfe:user?.id||""});
        }
    };
    return (
        <Div variant="bg_white" className="w-70 h-70  flex-col px-3">
            <Div className=" w-20 h-20 overflow-hidden border-2 border-black" shape="circle" >
                <img src={selectedFile || user?.avatar} alt="Avatar"
                    className=" object-cover object-center w-full h-full"
                />
            </Div>
            <Div className="flex-col">
                <H variant="text_black" className="text-lg font-bold text-center ">
                    {user?.name}
                </H>
                <P className="text-sm text-center">
                    {user?.email}
                </P>
            </Div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*" // Chỉ chấp nhận ảnh
                className="hidden"
            />
            <Button variant="gray" sizea="p4_2" className="w-full mt-4" onClick={handleButtonClick}>
                Tải ảnh mới
            </Button>
        </Div>


    )
}
export default AvatarProfile