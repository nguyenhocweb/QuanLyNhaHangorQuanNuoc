"use client"
import React, { useRef, useState } from "react";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useUpdateImage } from "@/src/features/shared/profile/profile_hook/useUpdateImage_hook";
import { FaCamera, FaUserCircle } from "react-icons/fa";
import { cn } from "@/src/core/lib/tw";

export const CustomerAvatarProfile = () => {
    const { user } = useAuthStore();
    const { mutate: updateImage, isPending } = useUpdateImage();

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        if (isPending) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setSelectedFile(objectUrl);
            updateImage({ file: file, folder: "/user/avatar", public_idfe: user?.id || "" });
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10"></div>
            
            {/* Avatar Image */}
            <div className="relative z-10 group mb-6">
                <div 
                    className={cn(
                        "w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50 flex items-center justify-center transition-all duration-300",
                        isPending && "opacity-50"
                    )}
                >
                    {(selectedFile || user?.avatar) ? (
                        <img 
                            src={selectedFile || user?.avatar} 
                            alt="Avatar"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <FaUserCircle className="text-gray-300 w-24 h-24" />
                    )}
                </div>

                {/* Upload Button Overlay */}
                <button 
                    onClick={handleButtonClick}
                    disabled={isPending}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                    title="Thay đổi ảnh đại diện"
                >
                    {isPending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <FaCamera className="text-sm" />
                    )}
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            {/* User Details */}
            <div className="z-10 flex flex-col items-center w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{user?.name || "Khách hàng"}</h2>
                <p className="text-gray-500 text-sm mb-4">{user?.email}</p>

                <div className="w-full h-px bg-gray-100 my-4"></div>

                <div className="flex w-full items-center justify-between px-2 text-sm">
                    <span className="text-gray-500">Vai trò</span>
                    <span className="font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Khách hàng</span>
                </div>
                {user?.sdt && (
                    <div className="flex w-full items-center justify-between px-2 text-sm mt-3">
                        <span className="text-gray-500">Số điện thoại</span>
                        <span className="font-medium text-gray-700">{user?.sdt}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
