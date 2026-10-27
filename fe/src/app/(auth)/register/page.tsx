"use client"
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { BiRestaurant } from "react-icons/bi";
import FormRegister from "@/src/features/auth/auth_components/register_form";
import FadeIn from "@/src/core/components/animation/FadeIn";

const Register = () => {
    const handleOAuth = (type: string) => {
        const beUrl = process.env.NEXT_PUBLIC_OAUTH_GOOGLE;
        window.location.href = `${beUrl}/${type}`;
    };

    return (
        <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center py-8 sm:py-12 px-4 relative bg-gradient-to-br from-slate-50 via-orange-50/25 to-amber-50/30">
            {/* Ambient decorative glowing orbs in contained layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[580px] h-[580px] bg-gradient-to-tr from-orange-300/20 via-amber-200/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
                {/* Subtle background grid pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
            </div>

            <FadeIn className="relative z-10 w-full max-w-lg my-auto">
                <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/60 p-6 sm:p-8">
                    {/* Brand header */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 mb-3">
                            <BiRestaurant className="text-3xl" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tạo tài khoản mới</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Đăng ký tài khoản để trải nghiệm toàn bộ tiện ích
                        </p>
                    </div>

                    {/* Register form */}
                    <FormRegister />

                    {/* Divider */}
                    <div className="relative my-6 w-full flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative px-3 bg-white text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Hoặc đăng ký bằng
                        </div>
                    </div>

                    {/* Social OAuth buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleOAuth("google")}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm text-sm font-semibold text-slate-700 cursor-pointer"
                        >
                            <FcGoogle className="text-xl shrink-0" />
                            <span>Google</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm text-sm font-semibold text-slate-700 cursor-pointer"
                        >
                            <FaFacebook className="text-xl text-[#1877F2] shrink-0" />
                            <span>Facebook</span>
                        </button>
                    </div>

                    {/* Switch to Login */}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        Đã có tài khoản?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                        >
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </FadeIn>
        </div>
    );
};

export default Register;