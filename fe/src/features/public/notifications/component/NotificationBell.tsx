import React, { useState, useRef, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useGetUnreadCount } from "../hook/useGetUnreadCount";
import { useNotificationSocket } from "../hook/useNotificationSocket";
import { NotificationDropdown } from "./NotificationDropdown";
import { AnimatePresence, motion } from "framer-motion";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Khởi chạy Socket listener
  useNotificationSocket();
  
  // Lấy data số lượng chưa đọc (độc lập với list)
  const { data } = useGetUnreadCount();
  const unreadCount = data?.metadata?.unreadCount || 0;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative flex items-center justify-center"
      >
        <IoIosNotificationsOutline className="w-6 h-6 text-gray-700" />
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white shadow-[0_0_8px_rgba(239,68,68,0.6)]">
            {unreadCount > 99 ? '99+' : unreadCount}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-80 sm:w-96 z-50 origin-top-right"
          >
            <NotificationDropdown onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
