"use client";
import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaRegBell, FaCheckCircle, FaExclamationCircle, FaRegClock, FaReceipt } from "react-icons/fa";
import { cn } from "@/src/core/lib/tw";

// --- MOCK DATA & TYPES ---
type NotificationType = "SYSTEM" | "ORDER" | "PROMOTION";
interface INotification {
    id: string;
    title: string;
    content: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
}

const MOCK_NOTIFICATIONS: INotification[] = [
    { id: "1", title: "Đơn hàng #1234 đã hoàn thành", content: "Cảm ơn bạn đã sử dụng dịch vụ. Hãy để lại đánh giá nhé!", type: "ORDER", isRead: false, createdAt: new Date().toISOString() },
    { id: "2", title: "Voucher giảm 50% tháng mới!", content: "Nhập mã HELLO_T8 để được giảm 50% (tối đa 50k).", type: "PROMOTION", isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "3", title: "Bảo trì hệ thống định kỳ", content: "Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai.", type: "SYSTEM", isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export const NotificationList = () => {
    // Trong thực tế, dùng useInfiniteQuery từ @tanstack/react-query
    const [notifications, setNotifications] = useState<INotification[]>(MOCK_NOTIFICATIONS);
    const [activeTab, setActiveTab] = useState<"ALL" | NotificationType>("ALL");

    // Lọc thông báo theo tab
    const filteredNotifications = notifications.filter(n => activeTab === "ALL" || n.type === activeTab);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Optimistic Update: Đánh dấu đã đọc
    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        // Gọi API update ở background
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        // Gọi API update toàn bộ
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "ORDER": return <FaReceipt className="text-emerald-500 text-lg" />;
            case "PROMOTION": return <FaCheckCircle className="text-amber-500 text-lg" />;
            case "SYSTEM": return <FaExclamationCircle className="text-blue-500 text-lg" />;
            default: return <FaRegBell className="text-gray-500 text-lg" />;
        }
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Header & Controls */}
            <FadeIn>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FaRegBell className="text-indigo-600" /> Thông báo của bạn
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                                    {unreadCount} mới
                                </span>
                            )}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Quản lý và theo dõi các cập nhật mới nhất</p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all"
                        >
                            Đánh dấu đọc tất cả
                        </button>
                    )}
                </div>
            </FadeIn>

            {/* Tabs */}
            <FadeIn delay={0.1}>
                <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto no-scrollbar">
                    {["ALL", "ORDER", "PROMOTION", "SYSTEM"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "px-5 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap",
                                activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            {tab === "ALL" ? "Tất cả" : tab === "ORDER" ? "Đơn hàng" : tab === "PROMOTION" ? "Khuyến mãi" : "Hệ thống"}
                        </button>
                    ))}
                </div>
            </FadeIn>

            {/* List */}
            <div className="flex flex-col gap-3">
                {filteredNotifications.length === 0 ? (
                    <FadeIn delay={0.2} className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4 text-2xl">
                            <FaRegBell />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Không có thông báo nào</h3>
                        <p className="text-gray-500 mt-1">Bạn đã xem hết tất cả thông báo trong mục này.</p>
                    </FadeIn>
                ) : (
                    filteredNotifications.map((notif, index) => (
                        <FadeIn key={notif.id} delay={0.1 + (index * 0.05)}>
                            <div
                                onClick={() => !notif.isRead && markAsRead(notif.id)}
                                className={cn(
                                    "p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 group cursor-pointer",
                                    notif.isRead 
                                        ? "bg-white border-gray-100 shadow-sm hover:shadow-md" 
                                        : "bg-indigo-50/50 border-indigo-100 shadow-sm hover:bg-indigo-50"
                                )}
                            >
                                {/* Icon Wrapper */}
                                <div className={cn(
                                    "p-3 rounded-full shrink-0",
                                    notif.isRead ? "bg-gray-100" : "bg-white shadow-sm ring-1 ring-indigo-100"
                                )}>
                                    {getIcon(notif.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className={cn("text-base truncate", notif.isRead ? "font-semibold text-gray-800" : "font-bold text-indigo-900")}>
                                            {notif.title}
                                        </h3>
                                        {!notif.isRead && (
                                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                                        )}
                                    </div>
                                    <p className={cn("text-sm line-clamp-2", notif.isRead ? "text-gray-500" : "text-gray-700")}>
                                        {notif.content}
                                    </p>
                                    <div className="flex items-center gap-1 mt-3 text-xs text-gray-400 font-medium">
                                        <FaRegClock />
                                        <span>
                                            {new Date(notif.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))
                )}
            </div>
        </div>
    );
};
