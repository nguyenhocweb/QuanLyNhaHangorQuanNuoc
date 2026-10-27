"use client";

import React from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import AvatarProfile from "@/src/features/shared/profile/profile_component/avatar_profile";
import ImformationProfile from "@/src/features/shared/profile/profile_component/information_profile";
import ChangePassword from "@/src/features/shared/profile/profile_component/changePassword";
import { BsPersonFill } from "react-icons/bs";
import { MdAdminPanelSettings } from "react-icons/md";

const SystemAdminProfilePage = () => {
  return (
    <FadeIn className="w-full flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Area */}
      <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
            <MdAdminPanelSettings className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Hồ sơ Quản trị viên
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-0.5">
              Quản lý thông tin tài khoản quản trị hệ thống và cài đặt bảo mật
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-4 w-full flex flex-col gap-6">
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col items-center p-6">
              <AvatarProfile />
            </div>
          </FadeIn>
        </div>

        {/* Right Column: Information & Password */}
        <div className="lg:col-span-8 w-full flex flex-col gap-6">
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <ImformationProfile />
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <ChangePassword />
            </div>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
};

export default SystemAdminProfilePage;
