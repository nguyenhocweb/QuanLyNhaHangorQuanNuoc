import React from "react";
import { useGetNotifications } from "../hook/useGetNotifications";
import { useMarkAsRead, useMarkAllAsRead } from "../hook/useMarkAsRead";
import { INotification } from "../type/notification.type";
import { IoCheckmarkDoneOutline as IoCheckmark, IoNotificationsOffOutline } from "react-icons/io5";
import { timeAgo } from "@/src/core/utils/time.util";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import Link from "next/link";

interface Props {
  onClose?: () => void;
}

export const NotificationDropdown: React.FC<Props> = ({ onClose }) => {
  const { activeWorkspace } = useAuthStore();
  const { data, isLoading } = useGetNotifications(1, 10);
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const notifications = data?.metadata?.data || [];
  const unreadCount = data?.metadata?.unreadCount || 0;

  const getSeeAllLink = () => {
    switch (activeWorkspace.type) {
      case 'CUSTOMER': return '/user/notifications';
      case 'BRAND': return '/brand_owner/notifications';
      case 'RESTAURANT': return '/quan-ly-nha-hang/notifications';
      case 'SYSTEM_ADMIN': return '/system/notifications';
      default: return '/user/notifications';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 overflow-hidden w-full max-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100/80 bg-white/50">
        <h3 className="font-semibold text-gray-800 text-base">Thông báo</h3>
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium transition-all duration-200 hover:bg-indigo-50 px-2 py-1 rounded-md"
          >
            <IoCheckmark className="text-sm" /> Đánh dấu đã đọc
          </button>
        )}
      </div>
      
      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          /* Skeleton Loader */
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-gray-200 mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded-md w-full"></div>
                  <div className="h-3 bg-gray-100 rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <IoNotificationsOffOutline className="text-3xl text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-sm">Không có thông báo nào</p>
            <p className="text-gray-400 text-xs mt-1">Bạn đã xem hết tất cả thông báo.</p>
          </div>
        ) : (
          /* Notification List */
          <div className="p-2 space-y-1">
            {notifications.map((notif: INotification) => (
              <div 
                key={notif.id}
                onClick={() => {
                  if (!notif.isRead) markAsRead(notif.id);
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                  notif.isRead 
                    ? "bg-transparent hover:bg-gray-50/80" 
                    : "bg-indigo-50/40 hover:bg-indigo-50/80 border border-indigo-100/50"
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h4 className={`text-sm leading-tight ${notif.isRead ? 'text-gray-700 font-medium' : 'text-gray-900 font-semibold'}`}>
                    {notif.title}
                  </h4>
                  {!notif.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1 shadow-sm"></div>}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">{notif.body}</p>
                <p className="text-[10px] text-gray-400 font-medium">
                  {timeAgo(notif.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100/80 bg-gray-50/50">
        <Link 
          href={getSeeAllLink()}
          onClick={onClose}
          className="block w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 py-2 rounded-lg transition-colors"
        >
          Xem tất cả thông báo
        </Link>
      </div>
    </div>
  );
};
