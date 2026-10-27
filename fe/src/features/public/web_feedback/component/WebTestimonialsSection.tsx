"use client";

import React, { useState } from "react";
import { FaStar, FaQuoteLeft, FaCommentDots, FaReply, FaPencilAlt } from "react-icons/fa";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useGetPublicWebFeedbacks } from "../hook/useGetPublicWebFeedbacks";
import { CreateFeedbackModal } from "./CreateFeedbackModal";

export const WebTestimonialsSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);

  const { data, isLoading } = useGetPublicWebFeedbacks({
    category: filterCategory,
    limit: 6
  });

  const feedbacks = Array.isArray(data?.feedbacks) ? data.feedbacks : [];
  const stats = data?.stats || { totalReviews: 0, averageRating: 5.0 };

  const CATEGORY_LABELS: Record<string, string> = {
    UI_UX: "Giao diện",
    PERFORMANCE: "Hiệu năng",
    FEATURE: "Tính năng",
    BUG_REPORT: "Báo lỗi",
    GENERAL: "Góp ý chung"
  };

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-orange-50/50 to-white relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <FadeIn isFirstFolder={true}>
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                <FaCommentDots className="w-3.5 h-3.5 text-orange-600" />
                <span>Trải Nghiệm Khách Hàng</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Đánh Giá & Nhận Xét Về Hệ Thống
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl font-medium">
                Lắng nghe những chia sẻ thực tế từ khách hàng và đối tác đã sử dụng nền tảng của chúng tôi.
              </p>
            </div>

            {/* Score Badge & Action Button */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3.5 p-3.5 px-5 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/80 shadow-sm">
                <div className="text-3xl sm:text-4xl font-black text-amber-500">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : "5.0"}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(stats.averageRating || 5) ? "text-amber-400 fill-amber-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-600 font-semibold block mt-0.5">
                    Dựa trên {stats.totalReviews} lượt đánh giá
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <FaPencilAlt className="w-3.5 h-3.5" />
                <span>Viết Đánh Giá</span>
              </button>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-2.5 mb-10">
            <button
              onClick={() => setFilterCategory(undefined)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                filterCategory === undefined
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white/90 text-slate-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              Tất cả ({stats.totalReviews})
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterCategory(key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  filterCategory === key
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white/90 text-slate-700 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Cards Grid or Beautiful Empty State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-56 bg-white/80 rounded-2xl border border-gray-100 shadow-sm animate-pulse" />
              ))}
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="relative overflow-hidden bg-white/90 backdrop-blur-md rounded-3xl border border-orange-200/60 shadow-lg p-10 sm:p-14 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white mx-auto mb-4 shadow-md">
                <FaCommentDots className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có đánh giá nào được duyệt</h3>
              <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                Hãy là người đầu tiên trải nghiệm và để lại nhận xét đóng góp để giúp chúng tôi ngày một hoàn thiện hơn!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <FaStar className="w-4 h-4 text-yellow-200" />
                <span>Gửi Đánh Giá Ngay</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between p-6 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/70 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 group"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            className={`w-4 h-4 ${s <= item.rating ? "text-amber-400" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {CATEGORY_LABELS[item.category] || "Góp ý"}
                      </span>
                    </div>

                    {/* Title */}
                    {item.title && (
                      <h4 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-1">{item.title}</h4>
                    )}

                    {/* Content */}
                    <p className="text-slate-700 text-sm leading-relaxed line-clamp-4 relative">
                      <FaQuoteLeft className="w-3 h-3 text-orange-300 inline mr-1.5 -mt-1" />
                      {item.content}
                    </p>
                  </div>

                  {/* Admin Reply (if exists) */}
                  {item.adminReply && (
                    <div className="mt-4 p-3.5 bg-orange-50/80 rounded-xl border border-orange-200 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-orange-900 mb-1">
                        <FaReply className="w-3 h-3 rotate-180" />
                        <span>Phản hồi từ Ban Quản Trị:</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">{item.adminReply}</p>
                    </div>
                  )}

                  {/* Bottom: Author & Date */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 text-xs text-slate-400">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black flex items-center justify-center text-xs shadow-xs">
                        {(item.guestName || "K")[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-800">{item.guestName || "Khách ẩn danh"}</span>
                    </div>
                    <span className="font-medium text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </FadeIn>
      </div>

      {/* Popup Form Modal */}
      <CreateFeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
