"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchemas, ChangePasswordForm } from "@/src/features/shared/profile/profile_schemas/changePassword_schemas";
import { useChangePassword } from "@/src/features/shared/profile/profile_hook/useChangPassword";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { FaRegEye, FaRegEyeSlash, FaLock, FaKey } from "react-icons/fa";

export const CustomerChangePassword = () => {
    const { user } = useAuthStore();
    const { mutate: changePassword, isPending } = useChangePassword();

    const [eye, setEye] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false
    });

    const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordForm>({
        resolver: zodResolver(ChangePasswordSchemas) as any,
        defaultValues: {
            id: user?.id,
        }
    });

    const toggleEye = (name: keyof typeof eye) => {
        setEye(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const onSubmit = (data: ChangePasswordForm) => {
        changePassword(data);
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Đổi mật khẩu</h2>
                <p className="text-gray-500 text-sm mt-1">Đảm bảo tài khoản của bạn đang sử dụng một mật khẩu an toàn</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Current Password */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <FaLock className="text-gray-400" /> Mật khẩu hiện tại <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={eye.currentPassword ? "text" : "password"}
                                id="currentPassword"
                                placeholder="Nhập mật khẩu cũ"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all pr-12"
                                {...register("currentPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => toggleEye("currentPassword")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                {eye.currentPassword ? <FaRegEye className="text-lg" /> : <FaRegEyeSlash className="text-lg" />}
                            </button>
                        </div>
                        {errors.currentPassword && <span className="text-xs text-red-500 font-medium">{errors.currentPassword.message}</span>}
                    </div>

                    {/* New Password */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="newPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <FaKey className="text-gray-400" /> Mật khẩu mới <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={eye.newPassword ? "text" : "password"}
                                id="newPassword"
                                placeholder="Nhập mật khẩu mới"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all pr-12"
                                {...register("newPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => toggleEye("newPassword")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                {eye.newPassword ? <FaRegEye className="text-lg" /> : <FaRegEyeSlash className="text-lg" />}
                            </button>
                        </div>
                        {errors.newPassword && <span className="text-xs text-red-500 font-medium">{errors.newPassword.message}</span>}
                    </div>

                    {/* Confirm New Password */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="confirmNewPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <FaKey className="text-gray-400" /> Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={eye.confirmNewPassword ? "text" : "password"}
                                id="confirmNewPassword"
                                placeholder="Nhập lại mật khẩu mới"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all pr-12"
                                {...register("confirmNewPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => toggleEye("confirmNewPassword")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                {eye.confirmNewPassword ? <FaRegEye className="text-lg" /> : <FaRegEyeSlash className="text-lg" />}
                            </button>
                        </div>
                        {errors.confirmNewPassword && <span className="text-xs text-red-500 font-medium">{errors.confirmNewPassword.message}</span>}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100 mt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                    >
                        {isPending && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        Lưu mật khẩu mới
                    </button>
                </div>
            </form>
        </div>
    );
};
