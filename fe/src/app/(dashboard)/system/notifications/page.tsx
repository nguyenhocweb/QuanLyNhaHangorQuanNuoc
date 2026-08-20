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
    <div className="w-full max-w-6xl mx-auto p-6 flex flex-col gap-8 relative">
      <FadeIn>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý Thông báo</h1>
            <p className="text-gray-500 mt-2">Gửi thông báo chủ động và theo dõi lịch sử</p>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 font-medium"
          >
            <FaPlus />
            Tạo thông báo mới
          </Button>
        </div>
      </FadeIn>

      <div className="w-full h-[700px] overflow-y-auto pr-2 custom-scrollbar bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <NotificationList workspaceTypeOverride="SYSTEM_ADMIN" />
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <FadeIn className="w-full max-w-3xl bg-white rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <FaTimes />
            </button>
            <div className="p-2">
              <PushNotificationForm onSuccess={() => setIsFormOpen(false)} />
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  );
}
