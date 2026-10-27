"use client";
import React, { useState } from "react";
import { PushNotificationForm } from "@/src/features/system_admin/notifications/components/PushNotificationForm";
import { NotificationList } from "@/src/features/customer/notifications/components/NotificationList";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Button } from "@/src/core/components/ui";
import { FaPlus, FaTimes } from "react-icons/fa";

export default function SystemPushNotificationsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-6 relative">
      <FadeIn className="w-full">
        <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
              Quản lý Thông báo
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
              Gửi thông báo chủ động và theo dõi lịch sử
            </p>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm cursor-pointer whitespace-nowrap mt-0.5 sm:mt-0"
          >
            <FaPlus className="text-xs shrink-0" />
            <span className="hidden sm:inline">Tạo thông báo mới</span>
            <span className="sm:hidden">Tạo mới</span>
          </Button>
        </div>
      </FadeIn>

      <div className="w-full">
        <NotificationList workspaceTypeOverride="SYSTEM_ADMIN" showHeader={false} />
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
          <FadeIn className="w-full max-w-3xl bg-white rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-400 hover:text-gray-600 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <FaTimes />
            </button>
            <div className="p-1 sm:p-2">
              <PushNotificationForm onSuccess={() => setIsFormOpen(false)} />
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  );
}
