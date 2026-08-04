"use client"
import React, { useEffect } from "react";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InformationProfileForm, InformationProfileSchema } from "@/src/features/shared/profile/profile_schemas/information_profile";
import { useUpdateProfile } from "@/src/features/shared/profile/profile_hook/information_profile";
import { toast } from "sonner";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaVenusMars } from "react-icons/fa";

export const CustomerInformationProfile = () => {
    const { user } = useAuthStore();
    const { mutate: updateProfile, isPending } = useUpdateProfile();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<InformationProfileForm>({
        resolver: zodResolver(InformationProfileSchema) as any,
    });

    useEffect(() => {
        if (user) {
            reset({
                id: user.id || "",
                name: user.name || "",
                date_of_birth: (user?.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : "") as any,
                gender: user.gender || ""
            });
        }
    }, [user, reset]);

    const onSubmit = (data: InformationProfileForm) => {
        const userDataOld = {
            id: user?.id || "",
            name: user?.name || "",
            date_of_birth: user?.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : "",
            gender: user?.gender || ""
        };

        if (JSON.stringify(userDataOld) === JSON.stringify(data)) {
            toast.info("Thông tin chưa được thay đổi");
            return;
        }
        updateProfile(data);
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
                <p className="text-gray-500 text-sm mt-1">Cập nhật thông tin cơ bản của bạn</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <FaUser className="text-gray-400" /> Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Nhập họ và tên"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            {...register("name")}
                        />
                        {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name.message}</span>}
                    </div>

                    {/* Email (Disabled) */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" /> Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                defaultValue={user?.email}
                                disabled
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none pr-24"
                            />
                            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline px-2">
                                Thay đổi
                            </button>
                        </div>
                    </div>

                    {/* Phone (Disabled) */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <FaPhone className="text-gray-400" /> Số điện thoại
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="phone"
                                defaultValue={user?.sdt}
                                disabled
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none pr-24"
                            />
                            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline px-2">
                                Thay đổi
                            </button>
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="dob" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" /> Ngày sinh <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="dob"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            {...register("date_of_birth")}
                        />
                        {errors.date_of_birth && <span className="text-xs text-red-500 font-medium">{errors.date_of_birth.message}</span>}
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="gender" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <FaVenusMars className="text-gray-400" /> Giới tính <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="gender"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                            {...register("gender")}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nu">Nữ</option>
                            <option value="Khac">Khác</option>
                        </select>
                        {errors.gender && <span className="text-xs text-red-500 font-medium">{errors.gender.message}</span>}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100 mt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                    >
                        {isPending && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        Lưu thông tin
                    </button>
                </div>
            </form>
        </div>
    );
};
