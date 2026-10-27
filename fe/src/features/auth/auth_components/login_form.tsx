"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginShema, loginForm } from "../auth_schemas/login_schemas";
import { useLogin } from "../auth_hook/login_hook";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Link from "next/link";

const FormLogin = () => {
    const [eye, setEye] = useState(false);
    const { mutate: loginMutation, isPending } = useLogin();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<loginForm>({
        resolver: zodResolver(LoginShema) as any,
        defaultValues: {
            user_name: "",
            password: "",
        },
    });

    const handleOnSubmit = (data: loginForm) => {
        loginMutation(data);
    };

    return (
        <form className="w-full flex flex-col gap-y-4" onSubmit={handleSubmit(handleOnSubmit)}>
            {/* Tên đăng nhập */}
            <div>
                <label htmlFor="user_name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="user_name"
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                        {...register("user_name")}
                    />
                    <CiUser className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xl text-slate-400 pointer-events-none" />
                </div>
                {errors.user_name && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.user_name.message}</p>
                )}
            </div>

            {/* Mật khẩu */}
            <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={eye ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setEye((e) => !e)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer focus:outline-none"
                    >
                        {eye ? <FaRegEye className="text-lg" /> : <FaRegEyeSlash className="text-lg" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
                )}
            </div>

            {/* Quên mật khẩu */}
            <div className="flex justify-end -mt-1">
                <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                >
                    Quên mật khẩu?
                </Link>
            </div>

            {/* Nút đăng nhập */}
            <button
                type="submit"
                disabled={isPending || isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
            >
                {isPending || isSubmitting ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Đang đăng nhập...</span>
                    </>
                ) : (
                    <span>Đăng nhập</span>
                )}
            </button>
        </form>
    );
};

export default FormLogin;