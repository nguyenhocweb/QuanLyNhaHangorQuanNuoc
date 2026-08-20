"use client";
import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaRegBell, FaCheckCircle, FaExclamationCircle, FaRegClock, FaReceipt, FaCalendarCheck, FaBox, FaCrown, FaTrashAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/src/core/lib/tw";
import { useGetNotifications } from "@/src/features/public/notifications/hook/useGetNotifications";
import { useMarkAsRead, useMarkAllAsRead } from "@/src/features/public/notifications/hook/useMarkAsRead";
import { useDeleteNotification } from "@/src/features/public/notifications/hook/useDeleteNotification";
import { NotificationType, INotification } from "@/src/features/public/notifications/type/notification.type";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { timeAgo } from "@/src/core/utils/time.util";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

const TABS_BY_ROLE: Record<string, { value: string, label: string }[]> = {
    CUSTOMER: [
        { value: "ALL", label: "Tất cả" },
        { value: "ORDER", label: "Đơn hàng" },
        { value: "RESERVATION", label: "Đặt bàn" },
        { value: "PROMOTION", label: "Khuyến mãi" },
        { value: "SYSTEM", label: "Hệ thống" },
    ],
    RESTAURANT: [
        { value: "ALL", label: "Tất cả" },
        { value: "ORDER", label: "Đơn hàng" },
        { value: "RESERVATION", label: "Đặt bàn" },
        { value: "INVENTORY", label: "Kho hàng" },
        { value: "SYSTEM", label: "Hệ thống" },
    ],
    BRAND: [
        { value: "ALL", label: "Tất cả" },
        { value: "SUBSCRIPTION", label: "Gói cước" },
        { value: "PROMOTION", label: "Khuyến mãi" },
        { value: "SYSTEM", label: "Hệ thống" },
    ],
    SYSTEM_ADMIN: [
        { value: "ALL", label: "Tất cả" },
        { value: "SUBSCRIPTION", label: "Gói cước" },
        { value: "SYSTEM", label: "Hệ thống" },
    ]
};

interface NotificationListProps {
    workspaceTypeOverride?: "CUSTOMER" | "RESTAURANT" | "BRAND" | "SYSTEM_ADMIN";
}

export const NotificationList = ({ workspaceTypeOverride }: NotificationListProps = {}) => {
    const { activeWorkspace } = useAuthStore();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [activeTab, setActiveTab] = useState<"ALL" | NotificationType>("ALL");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    
    const currentWorkspaceType = workspaceTypeOverride || activeWorkspace.type || "CUSTOMER";
    const roleTabs = TABS_BY_ROLE[currentWorkspaceType] || TABS_BY_ROLE["CUSTOMER"];

    // Lọc theo tab (trừ ALL)
    const filterType = activeTab === "ALL" ? undefined : activeTab;
    
    const { data, isLoading } = useGetNotifications(page, limit, filterType, workspaceTypeOverride);
    const { mutate: markAsRead } = useMarkAsRead(workspaceTypeOverride);
    const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead(workspaceTypeOverride);
    const { mutate: deleteNotification } = useDeleteNotification(workspaceTypeOverride);

    const notifications = data?.metadata?.data || [];
    const total = data?.metadata?.total || 0;
    const unreadCount = data?.metadata?.unreadCount || 0;
    const totalPages = Math.ceil(total / limit);

    const getIcon = (type: string) => {
        switch (type) {
            case "ORDER": return <FaReceipt className="text-emerald-500 text-lg" />;
            case "PROMOTION": return <FaCheckCircle className="text-amber-500 text-lg" />;
            case "SYSTEM": return <FaExclamationCircle className="text-blue-500 text-lg" />;
            case "RESERVATION": return <FaCalendarCheck className="text-indigo-500 text-lg" />;
            case "INVENTORY": return <FaBox className="text-orange-500 text-lg" />;
            case "SUBSCRIPTION": return <FaCrown className="text-yellow-500 text-lg" />;
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
                            onClick={() => markAllAsRead()}
                            disabled={isMarkingAll}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                        >
                            Đánh dấu đọc tất cả
                        </button>
                    )}
                </div>
            </FadeIn>

            {/* Tabs */}
            <FadeIn delay={0.1}>
                <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto no-scrollbar">
                    {roleTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => { setActiveTab(tab.value as any); setPage(1); }}
                            className={cn(
                                "px-5 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap",
                                activeTab === tab.value ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </FadeIn>

            {/* List */}
            <div className="flex flex-col gap-3 min-h-[400px]">
                {isLoading ? (
                    /* Skeleton Loaders */
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="p-5 rounded-2xl border bg-white shadow-sm flex gap-4 animate-pulse">
                                <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
                                <div className="flex-1 space-y-3 mt-1">
                                    <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
                                    <div className="h-3 bg-gray-100 rounded-md w-full"></div>
                                    <div className="h-3 bg-gray-100 rounded-md w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <FadeIn delay={0.2} className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4 text-2xl">
                            <FaRegBell />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Không có thông báo nào</h3>
                        <p className="text-gray-500 mt-1">Bạn đã xem hết hoặc không có thông báo trong mục này.</p>
                    </FadeIn>
                ) : (
                    <AnimatePresence>
                        {notifications.map((notif: INotification, index: number) => (
                            <motion.div 
                                key={notif.id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className="relative group"
                            >
                                <div
                                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                                    className={cn(
                                        "p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer hover:-translate-y-0.5",
                                        notif.isRead 
                                            ? "bg-white border-gray-100 shadow-sm hover:shadow-md" 
                                            : "bg-indigo-50/40 border-indigo-100 shadow-sm hover:bg-indigo-50/80"
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
                                    <div className="flex-1 flex flex-col min-w-0 pr-10">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h3 className={cn("text-base truncate", notif.isRead ? "font-semibold text-gray-800" : "font-bold text-indigo-900")}>
                                                {notif.title}
                                            </h3>
                                            {!notif.isRead && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                                            )}
                                        </div>
                                        <p className={cn("text-sm line-clamp-2", notif.isRead ? "text-gray-500" : "text-gray-700")}>
                                            {notif.body}
                                        </p>
                                        <div className="flex items-center gap-1 mt-3 text-xs text-gray-400 font-medium">
                                            <FaRegClock />
                                            <span>
                                                {timeAgo(notif.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletingId(notif.id);
                                    }}
                                    className="absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-xl bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-100 hover:scale-110"
                                    title="Xóa thông báo"
                                >
                                    <FaTrashAlt />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Pagination Controls */}
            {total > 0 && (
                <FadeIn delay={0.3}>
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm gap-4">
                        <span className="text-sm text-gray-500 font-medium">
                            Hiển thị {((page - 1) * limit) + 1} đến {Math.min(page * limit, total)} của {total} kết quả
                        </span>
                        
                        <div className="flex items-center gap-3">
                            <select 
                                value={limit} 
                                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} 
                                className="border border-gray-200 text-gray-600 rounded-lg text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                <option value={10}>10 / trang</option>
                                <option value={20}>20 / trang</option>
                                <option value={50}>50 / trang</option>
                            </select>
                            
                            <div className="flex gap-1">
                                <button 
                                    disabled={page === 1} 
                                    onClick={() => setPage(p => p - 1)} 
                                    className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Trước
                                </button>
                                <button 
                                    disabled={page >= totalPages} 
                                    onClick={() => setPage(p => p + 1)} 
                                    className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            )}

            <ConfirmModal 
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={() => {
                    if (deletingId) deleteNotification(deletingId);
                    setDeletingId(null);
                }}
                title="Xóa thông báo"
                message="Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác."
            />
        </div>
    );
};
