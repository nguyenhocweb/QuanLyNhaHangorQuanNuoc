"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CiUser } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { RegisterSchema, RegisterFormValues } from "../auth_schemas/register_schemas";
import { useRegister } from "../auth_hook/useRegister";

const FormRegister = () => {
    const [newPass, setNewPass] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);

    const { mutate: registerMutation, isPending } = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterSchema) as any,
        defaultValues: {
            user_name: "",
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            date_of_birth: "",
            gender: "",
        },
    });

    const onSubmit = (data: RegisterFormValues) => {
        registerMutation(data);
    };

    return (
        <form className="w-full flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Tên đăng nhập */}
            <div>
                <label htmlFor="user_name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="user_name"
                        type="text"
                        placeholder="Nhập tên đăng nhập (tối thiểu 3 ký tự)"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                        {...register("user_name")}
                    />
                    <CiUser className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xl text-slate-400 pointer-events-none" />
                </div>
                {errors.user_name && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.user_name.message}</p>
                )}
            </div>

            {/* Họ và tên */}
            <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Họ và tên
                </label>
                <div className="relative">
                    <input
                        id="name"
                        type="text"
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                        {...register("name")}
                    />
                    <CiUser className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xl text-slate-400 pointer-events-none" />
                </div>
                {errors.name && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.name.message}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="email"
                        type="email"
                        placeholder="example@domain.com"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                        {...register("email")}
                    />
                    <TfiEmail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400 pointer-events-none" />
                </div>
                {errors.email && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
                )}
            </div>

            {/* Ngày sinh & Giới tính */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label htmlFor="date_of_birth" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Ngày sinh
                    </label>
                    <input
                        id="date_of_birth"
                        type="date"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                        {...register("date_of_birth")}
                    />
                    {errors.date_of_birth && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.date_of_birth.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="gender" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Giới tính
                    </label>
                    <select
                        id="gender"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all cursor-pointer"
                        {...register("gender")}
                    >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nu">Nữ</option>
                        <option value="Khac">Khác</option>
                    </select>
                    {errors.gender && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.gender.message}</p>
                    )}
                </div>
            </div>

            {/* Mật khẩu mới */}
            <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type={newPass ? "text" : "password"}
                        id="password"
                        placeholder="Tối thiểu 8 ký tự (hoa, thường, số, ký tự đặc biệt)"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setNewPass((e) => !e)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer focus:outline-none"
                    >
                        {newPass ? <FaRegEye className="text-lg" /> : <FaRegEyeSlash className="text-lg" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
                )}
            </div>

            {/* Nhập lại Mật khẩu */}
            <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nhập lại Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type={confirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Nhập lại mật khẩu vừa nhập"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                        {...register("confirmPassword")}
                    />
                    <button
                        type="button"
                        onClick={() => setConfirmPassword((e) => !e)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer focus:outline-none"
                    >
                        {confirmPassword ? <FaRegEye className="text-lg" /> : <FaRegEyeSlash className="text-lg" />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
                )}
            </div>

            {/* Nút đăng ký */}
            <button
                type="submit"
                disabled={isPending || isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
            >
                {isPending || isSubmitting ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Đang đăng ký tài khoản...</span>
                    </>
                ) : (
                    <span>Đăng ký tài khoản</span>
                )}
            </button>
        </form>
    );
};

export default FormRegister;