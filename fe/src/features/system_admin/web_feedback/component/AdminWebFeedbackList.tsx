"use client";

import React, { useState } from "react";
import {
  FaStar,
  FaCheck,
  FaTimes,
  FaBan,
  FaReply,
  FaTrash,
  FaSearch,
  FaCommentDots,
  FaChevronLeft,
  FaChevronRight,
  FaGlobe,
  FaDesktop
} from "react-icons/fa";
import FadeIn from "@/src/core/components/animation/FadeIn";
import useDebounce from "@/src/core/hooks/useDebounce";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { useGetAdminWebFeedbacks } from "../hook/useGetAdminWebFeedbacks";
import { useUpdateAdminWebFeedback } from "../hook/useUpdateAdminWebFeedback";
import { useDeleteAdminWebFeedback } from "../hook/useDeleteAdminWebFeedback";
import { IAdminWebFeedback, FeedbackStatus, FeedbackCategory } from "../type/web_feedback_admin.type";
import { AdminFeedbackReplyModal } from "./AdminFeedbackReplyModal";

const STATUS_TABS: { label: string; value?: FeedbackStatus }[] = [
  { label: "Tất cả", value: undefined },
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Bị từ chối", value: "REJECTED" },
  { label: "Spam", value: "SPAM" }
];

export const AdminWebFeedbackList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce({ value: searchTerm, delay: 400 });

  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals state
  const [replyFeedback, setReplyFeedback] = useState<IAdminWebFeedback | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useGetAdminWebFeedbacks({
    page,
    limit,
    status: selectedStatus,
    category: selectedCategory,
    search: debouncedSearch || undefined
  });

  const { mutate: updateFeedback, isPending: isUpdating } = useUpdateAdminWebFeedback();
  const { mutate: deleteFeedback, isPending: isDeleting } = useDeleteAdminWebFeedback();

  const feedbacks = Array.isArray(data?.feedbacks) ? data.feedbacks : [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };


  const handleStatusChange = (id: string, newStatus: FeedbackStatus) => {
    updateFeedback({ id, payload: { status: newStatus } });
  };

  const handleToggleFeatured = (item: IAdminWebFeedback) => {
    updateFeedback({ id: item.id, payload: { isFeatured: !item.isFeatured } });
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteFeedback(deletingId, {
        onSuccess: () => setDeletingId(null)
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <FadeIn className="w-full">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <FaCommentDots className="w-6 h-6 text-orange-500" />
              <span>Quản Lý Đánh Giá Website</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Kiểm duyệt, phản hồi và ghim các đánh giá, đóng góp ý kiến từ người dùng trên toàn hệ thống.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200">
              Tổng số: {pagination.total} đánh giá
            </span>
          </div>
        </div>
      </FadeIn>

      <FadeIn className="w-full">
        {/* Filter Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => {
                  setSelectedStatus(tab.value);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedStatus === tab.value
                    ? "bg-white text-orange-600 shadow-sm ring-1 ring-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Tìm theo tên, email, nội dung..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            <select
              value={selectedCategory || ""}
              onChange={(e) => {
                setSelectedCategory((e.target.value as FeedbackCategory) || undefined);
                setPage(1);
              }}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              <option value="">Tất cả danh mục</option>
              <option value="GENERAL">Góp ý chung</option>
              <option value="UI_UX">Giao diện (UI/UX)</option>
              <option value="FEATURE">Tính năng mới</option>
              <option value="PERFORMANCE">Hiệu năng / Tốc độ</option>
              <option value="BUG_REPORT">Báo lỗi</option>
            </select>
          </div>
        </div>
      </FadeIn>

      {/* Content Table / Cards */}
      <FadeIn className="w-full">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-16 p-6">
              <FaCommentDots className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-semibold text-sm">Không tìm thấy nhận xét đánh giá nào.</p>
              <p className="text-gray-400 text-xs mt-1">Hãy thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {feedbacks.map((item) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 hover:bg-gray-50/70 transition-colors flex flex-col lg:flex-row lg:items-start justify-between gap-6"
                >
                  {/* Left Column: Review Content */}
                  <div className="flex-1 space-y-2.5">
                    {/* Top row badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Rating */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= item.rating ? "text-amber-400" : "text-gray-200"}`}
                          />
                        ))}
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : item.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : item.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {item.status === "APPROVED" && "Đã duyệt"}
                        {item.status === "PENDING" && "Chờ duyệt"}
                        {item.status === "REJECTED" && "Từ chối"}
                        {item.status === "SPAM" && "Spam"}
                      </span>

                      {/* Category Badge */}
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600">
                        {item.category}
                      </span>

                      {/* Featured Star */}
                      {item.isFeatured && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 flex items-center gap-1">
                          ⭐ Ghim Testimonial
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    {item.title && <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>}

                    {/* Content */}
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </p>

                    {/* Context Meta (Page URL & Device Info) */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-400 pt-1">
                      {item.pageUrl && (
                        <span className="flex items-center gap-1">
                          <FaGlobe className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-xs">{item.pageUrl}</span>
                        </span>
                      )}
                      {item.deviceInfo && (
                        <span className="flex items-center gap-1">
                          <FaDesktop className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-xs">{item.deviceInfo.slice(0, 40)}...</span>
                        </span>
                      )}
                      <span>IP: {item.ipAddress || "N/A"}</span>
                      <span>Ngày gửi: {new Date(item.createdAt).toLocaleString("vi-VN")}</span>
                    </div>

                    {/* Admin Reply & Note */}
                    {item.adminReply && (
                      <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs">
                        <div className="font-semibold text-indigo-900 mb-0.5 flex items-center gap-1">
                          <FaReply className="w-3 h-3 rotate-180" />
                          <span>Phản hồi công khai:</span>
                        </div>
                        <p className="text-indigo-800">{item.adminReply}</p>
                      </div>
                    )}
                    {item.adminNote && (
                      <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-amber-900">
                        <span className="font-semibold">Ghi chú nội bộ:</span> {item.adminNote}
                      </div>
                    )}
                  </div>

                  {/* Right Column: User Info & Actions */}
                  <div className="flex flex-col sm:items-end justify-between gap-4 min-w-[200px] border-t lg:border-t-0 pt-3 lg:pt-0">
                    <div className="sm:text-right">
                      <div className="font-bold text-gray-900 text-xs sm:text-sm">
                        {item.guestName || "Khách ẩn danh"}
                      </div>
                      {item.guestEmail && (
                        <div className="text-xs text-gray-500">{item.guestEmail}</div>
                      )}
                      {item.guestPhone && (
                        <div className="text-xs text-gray-500">{item.guestPhone}</div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Approve / Reject */}
                      {item.status !== "APPROVED" && (
                        <button
                          onClick={() => handleStatusChange(item.id, "APPROVED")}
                          disabled={isUpdating}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-all"
                          title="Duyệt đánh giá này"
                        >
                          <FaCheck className="w-3 h-3" />
                          <span>Duyệt</span>
                        </button>
                      )}
                      {item.status !== "REJECTED" && (
                        <button
                          onClick={() => handleStatusChange(item.id, "REJECTED")}
                          disabled={isUpdating}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                          title="Từ chối đánh giá"
                        >
                          <FaTimes className="w-3 h-3" />
                          <span>Từ chối</span>
                        </button>
                      )}
                      {item.status !== "SPAM" && (
                        <button
                          onClick={() => handleStatusChange(item.id, "SPAM")}
                          disabled={isUpdating}
                          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                          title="Báo là Spam"
                        >
                          <FaBan className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Toggle Featured */}
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        disabled={isUpdating}
                        className={`p-2 rounded-xl transition-all ${
                          item.isFeatured
                            ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                            : "text-gray-400 hover:text-amber-500 hover:bg-gray-100"
                        }`}
                        title={item.isFeatured ? "Bỏ ghim Landing page" : "Ghim lên Landing page"}
                      >
                        <FaStar className="w-3.5 h-3.5" />
                      </button>

                      {/* Reply Button */}
                      <button
                        onClick={() => setReplyFeedback(item)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Phản hồi đánh giá"
                      >
                        <FaReply className="w-3.5 h-3.5 rotate-180" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Xóa nhận xét"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Bar */}
          {pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50/50 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Hiển thị <span className="font-semibold text-gray-800">{(page - 1) * limit + 1}</span> đến{" "}
                <span className="font-semibold text-gray-800">
                  {Math.min(page * limit, pagination.total)}
                </span>{" "}
                của <span className="font-semibold text-gray-800">{pagination.total}</span> kết quả
              </div>

              <div className="flex items-center gap-3">
                {/* Rows per page */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Số dòng:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="px-2 py-1 bg-white border border-gray-200 rounded-lg focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Page Nav */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <FaChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg">
                    {page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                    disabled={page >= pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <FaChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Reply Modal */}
      <AdminFeedbackReplyModal
        feedback={replyFeedback}
        isOpen={!!replyFeedback}
        onClose={() => setReplyFeedback(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!deletingId}
        title="Xóa nhận xét đánh giá?"
        content="Bạn có chắc chắn muốn xóa vĩnh viễn nhận xét đánh giá này không? Hành động này không thể hoàn tác."
        type="danger"
        isLoading={isDeleting}
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
