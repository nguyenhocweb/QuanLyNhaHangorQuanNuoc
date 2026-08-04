"use client"
import React from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { CustomerAvatarProfile } from "@/src/features/customer/profile/components/CustomerAvatarProfile";
import { CustomerInformationProfile } from "@/src/features/customer/profile/components/CustomerInformationProfile";
import { CustomerChangePassword } from "@/src/features/customer/profile/components/CustomerChangePassword";
import { BsPersonFill } from "react-icons/bs";

export default function CustomerProfilePage() {
    return (
        <FadeIn className="w-full flex flex-col gap-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header Area */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    <BsPersonFill className="text-indigo-600" /> Hồ sơ cá nhân
                </h1>
                <p className="text-slate-500 text-base">
                    Quản lý thông tin tài khoản, mật khẩu và tùy chọn bảo mật của bạn.
                </p>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mt-2">
                {/* Left Column: Avatar & Overview */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <FadeIn delay={0.1}>
                        <CustomerAvatarProfile />
                    </FadeIn>
                </div>

                {/* Right Column: Information & Password */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <FadeIn delay={0.2}>
                        <CustomerInformationProfile />
                    </FadeIn>
                    
                    <FadeIn delay={0.3}>
                        <CustomerChangePassword />
                    </FadeIn>
                </div>
            </div>
        </FadeIn>
    );
}
