"use client";

import { JSX, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiInfo, 
  FiX,
  FiLoader 
} from "react-icons/fi";
// Import các component từ index.tsx của bạn
import { Div, Button, H, P } from "../../components/ui"; 

type ModalType = "success" | "warning" | "danger" | "info";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  type?: ModalType;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  hideConfirmButton?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Map ModalType sang các variant có sẵn trong Button.tsx của bạn
const typeStyles: Record<ModalType, { 
    icon: JSX.Element; 
    iconBg: string; 
    btnVariant: "green" | "red" | "blue" | "mau1" 
}> = {
  success: {
    icon: <FiCheckCircle className="h-6 w-6 text-green-600" />,
    iconBg: "bg-green-100",
    btnVariant: "green",
  },
  warning: {
    icon: <FiAlertTriangle className="h-6 w-6 text-orange-600" />,
    iconBg: "bg-orange-100",
    btnVariant: "red", 
  },
  danger: {
    icon: <FiAlertTriangle className="h-6 w-6 text-red-600" />,
    iconBg: "bg-red-100",
    btnVariant: "red",
  },
  info: {
    icon: <FiInfo className="h-6 w-6 text-blue-600" />,
    iconBg: "bg-blue-100",
    btnVariant: "blue",
  },
};

export function ConfirmModal({
  open,
  title,
  content,
  type = "info",
  isLoading = false,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  hideConfirmButton = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  
  // State để kiểm tra client-side (tránh lỗi Hydration của Next.js)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !isLoading) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isLoading, onClose]);

  // Render null nếu chưa mount trên client hoặc modal không mở
  if (!open || !mounted) return null;

  const currentStyle = typeStyles[type];

  // Sử dụng createPortal để đưa Modal ra khỏi hệ thống phân lớp hiện tại (đẩy thẳng ra body)
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-2 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <Div 
        variant="bg_white" 
        shape="square" 
        className="relative w-full max-w-100 flex-col items-stretch overflow-hidden rounded-2xl !p-0  animate-in fade-in zoom-in-95 duration-200 "
      >
        {/* Nút đóng */}
        <div className="absolute right-2 top-2 hidden sm:block">
          <button
            type="button"
            className="rounded-lg bg-white p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
            onClick={onClose}
            disabled={isLoading}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung Modal */}
        <Div variant="default" className=" items-start justify-start px-3 sm:flex-row my-4 gap-4">
          {/* Icon */}
          <Div 
            shape="square" 
            className={`h-12 w-12 shrink-0 ${currentStyle.iconBg} sm:h-10 sm:w-10`}
          >
            {currentStyle.icon}
          </Div>
          
          <Div variant="default" className="mt-3 flex-col items-center text-center  sm:mt-0 sm:items-start sm:text-left">
            <H variant="text_black" className="text-lg">
              {title}
            </H>
            <div className="mt-2 text-sm text-gray-600 leading-relaxed">
              {content}
            </div>
          </Div>
        </Div>

        {/* Footer Actions */}
        <div className=" px-4 py-4 flex flex-row items-center justify-end gap-3 w-full rounded-b-2xl ">
          <Button
            variant="white"
            shape="square"
            sizea="p4_2"
            className="min-w-[7rem] max-w-[10rem] disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isLoading}
          >
            <span className="truncate w-full text-center">
              {cancelText} 
            </span>
          </Button>
          
          {!hideConfirmButton && (
            <Button
              variant={currentStyle.btnVariant}
              shape="square"
              sizea="p4_2"
              className="min-w-[7rem] max-w-[12rem] disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center truncate w-full">
                  <FiLoader className="mr-2 h-4 w-4 animate-spin shrink-0" />
                  Đang xử lý...
                </span>
              ) : (
                <span className="truncate w-full text-center">
                  {confirmText}
                </span>
              )}
            </Button>
          )}
        </div>
      </Div>
    </div>,
    document.body
  );
}