"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaStar, FaTimes, FaPaperPlane, FaBug, FaPaintBrush, FaBolt, FaRocket, FaCommentDots } from "react-icons/fa";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { createWebFeedbackSchema, CreateWebFeedbackFormValues } from "../schema/web_feedback.create.schema";
import { useCreateWebFeedback } from "../hook/useCreateWebFeedback";

interface CreateFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { value: "GENERAL", label: "Góp ý chung", icon: FaCommentDots },
  { value: "UI_UX", label: "Giao diện (UI/UX)", icon: FaPaintBrush },
  { value: "FEATURE", label: "Tính năng mới", icon: FaRocket },
  { value: "PERFORMANCE", label: "Tốc độ / Hiệu năng", icon: FaBolt },
  { value: "BUG_REPORT", label: "Báo lỗi hệ thống", icon: FaBug }
];

export const CreateFeedbackModal: React.FC<CreateFeedbackModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateWebFeedbackFormValues>({
    resolver: zodResolver(createWebFeedbackSchema) as any,
    defaultValues: {
      rating: 5,
      category: "GENERAL",
      content: "",
      title: "",
      guestName: "",
      guestEmail: "",
      guestPhone: ""
    }
  });

  const rating = watch("rating");
  const selectedCategory = watch("category");

  // Tự động thu thập thông tin ngữ cảnh môi trường (URL, OS/Browser, Màn hình)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setValue("pageUrl", window.location.href);
      setValue("deviceInfo", `${navigator.userAgent}`);
      setValue("screenResolution", `${window.screen.width}x${window.screen.height}`);
    }
  }, [setValue, isOpen]);

  const { mutate: submitFeedback, isPending } = useCreateWebFeedback(() => {
    reset();
    onClose();
  });

  const onSubmit = (values: CreateWebFeedbackFormValues) => {
    submitFeedback(values);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <FadeIn isFirstFolder={true} className="w-full max-w-xl my-auto">
        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <FaStar className="w-5 h-5 text-yellow-200 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Đánh giá & Góp ý Website</h3>
                <p className="text-xs text-orange-100">Ý kiến của bạn giúp chúng tôi hoàn thiện hệ thống tốt hơn</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 cursor-pointer"
              aria-label="Đóng"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Star Rating */}
            <div className="flex flex-col items-center justify-center p-4 bg-orange-50/60 rounded-xl border border-orange-100/80">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Bạn đánh giá trải nghiệm trang web thế nào? <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue("rating", star, { shouldValidate: true })}
                    className="p-1.5 transition-transform hover:scale-125 duration-150 focus:outline-none cursor-pointer"
                  >
                    <FaStar
                      className={`w-8 h-8 ${
                        star <= (rating || 0)
                          ? "text-amber-400 drop-shadow-sm fill-amber-400"
                          : "text-gray-300 hover:text-amber-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-medium text-amber-700 mt-1">
                {rating === 5 && "⭐ Xuất sắc - Rất hài lòng"}
                {rating === 4 && "👍 Rất tốt - Trải nghiệm mượt"}
                {rating === 3 && "👌 Bình thường - Cần cải thiện"}
                {rating === 2 && "⚠️ Chưa tốt - Còn nhiều hạn chế"}
                {rating === 1 && "❌ Kém - Gặp nhiều trục trặc"}
              </span>
              {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>}
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Danh mục góp ý
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setValue("category", cat.value as any)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-orange-500 text-white border-orange-500 shadow-sm font-bold"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title & Content */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tiêu đề (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giao diện rất đẹp, Đặt bàn siêu nhanh..."
                  {...register("title")}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nội dung chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Hãy chia sẻ chi tiết trải nghiệm, tính năng bạn thích hoặc lỗi bạn gặp phải..."
                  {...register("content")}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
                {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
              </div>
            </div>

            {/* Guest Info (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Họ tên của bạn</label>
                <input
                  type="text"
                  placeholder="Khách ẩn danh"
                  {...register("guestName")}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email liên hệ (nếu cần hỗ trợ)</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  {...register("guestEmail")}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
                {errors.guestEmail && <p className="text-xs text-red-500 mt-1">{errors.guestEmail.message}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <FaPaperPlane className="w-3.5 h-3.5" />
                <span>{isPending ? "Đang gửi góp ý..." : "Gửi Đánh Giá"}</span>
              </button>
            </div>
          </form>
        </div>
      </FadeIn>
    </div>,
    document.body
  );
};
