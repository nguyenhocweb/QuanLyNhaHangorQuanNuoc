"use client";

import React, { useState } from "react";
import {
  FaHeadset,
  FaSearch,
  FaPhoneAlt,
  FaEnvelope,
  FaCheckCircle,
  FaClock,
  FaTrash,
  FaEdit,
  FaFilter,
  FaUserTie
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import useDebounce from "@/src/core/hooks/useDebounce";
import { useGetAdminContactTickets } from "../hook/useGetAdminContactTickets";
import { useDeleteAdminContactTicket } from "../hook/useDeleteAdminContactTicket";
import { IAdminContactTicket, TicketStatus } from "../type/contact_ticket_admin.type";
import { AdminContactTicketReplyModal } from "./AdminContactTicketReplyModal";

const STATUS_TABS = [
  { key: "ALL", label: "Tất Cả" },
  { key: "OPEN", label: "🟡 Mới Tiếp Nhận" },
  { key: "PROCESSING", label: "🔵 Đang Xử Lý" },
  { key: "RESOLVED", label: "🟢 Đã Giải Quyết" },
  { key: "CLOSED", label: "⚫ Đã Đóng" }
];

export const AdminContactTicketList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce({ value: searchInput, delay: 400 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedTicket, setSelectedTicket] = useState<IAdminContactTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useGetAdminContactTickets({
    status: statusFilter,
    search: debouncedSearch,
    page,
    limit
  });

  const tickets = data?.data?.tickets || [];
  const pagination = data?.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const { mutate: deleteTicket, isPending: isDeleting } = useDeleteAdminContactTicket();

  const handleOpenDetail = (ticket: IAdminContactTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-200">🔥 KHẨN CẤP</span>;
      case "HIGH":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">Ưu tiên cao</span>;
      case "MEDIUM":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">Trung bình</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700">Thấp</span>;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "OPEN":
        return <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" /> Mới nhận</span>;
      case "PROCESSING":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 w-fit">Đang xử lý</span>;
      case "RESOLVED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 w-fit">Đã giải quyết</span>;
      case "CLOSED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 w-fit">Đã đóng</span>;
    }
  };

  return (
    <div className="w-full space-y-6">
      <FadeIn isFirstFolder={true}>
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-xs">
              <FaHeadset className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Trung Tâm Hỗ Trợ & Phiếu CSKH</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Tiếp nhận yêu cầu tư vấn, hỗ trợ kỹ thuật và báo giá từ khách hàng & đối tác
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
              Tổng số: <strong>{pagination.total}</strong> ticket
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.key);
                  setPage(1);
                }}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <FaSearch className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo Mã, Tên, SĐT, Email..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>
        </div>

        {/* Ticket List Table / Cards */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8">
            <FaHeadset className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-700 font-bold text-base">Không có phiếu hỗ trợ nào.</h3>
            <p className="text-xs text-slate-500 mt-1">Khi khách hàng gửi yêu cầu qua form /contact, dữ liệu sẽ hiển thị ở đây.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => {
              const cleanPhone = t.guestPhone ? t.guestPhone.replace(/\D/g, "") : "";
              return (
                <div
                  key={t.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Code, Guest info, Message */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-extrabold text-indigo-600 text-xs bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                        {t.ticketCode}
                      </span>
                      {getStatusBadge(t.status)}
                      {getPriorityBadge(t.priority)}
                      <span className="text-[11px] text-slate-400">
                        • {new Date(t.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
                        <span>{t.guestName}</span>
                        {t.subject && <span className="text-slate-500 font-normal text-xs">— {t.subject}</span>}
                      </div>
                      <p className="text-xs text-slate-700 mt-1 line-clamp-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        "{t.message}"
                      </p>
                    </div>

                    {/* Quick Contacts & Notes */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <FaEnvelope className="w-3 h-3 text-slate-400" />
                        <a href={`mailto:${t.guestEmail}`} className="hover:text-indigo-600 font-medium">
                          {t.guestEmail}
                        </a>
                      </span>

                      {t.guestPhone && (
                        <a
                          href={`tel:${cleanPhone}`}
                          className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                        >
                          <FaPhoneAlt className="w-2.5 h-2.5" />
                          <span>{t.guestPhone}</span>
                        </a>
                      )}

                      {t.hasZalo && cleanPhone && (
                        <a
                          href={`https://zalo.me/${cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline bg-blue-50 px-2 py-0.5 rounded-md"
                        >
                          <SiZalo className="w-3 h-3" />
                          <span>Chat Zalo</span>
                        </a>
                      )}

                      {t.assignedTo && (
                        <span className="text-slate-600 flex items-center gap-1 font-semibold text-[11px]">
                          <FaUserTie className="w-3 h-3 text-indigo-500" />
                          <span>Phụ trách: {t.assignedTo}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 lg:flex-col lg:items-end justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(t)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer whitespace-nowrap"
                    >
                      <FaEdit className="w-3 h-3" />
                      <span>Xử Lý & Phản Hồi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(t.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                      title="Xóa phiếu này"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-xs text-slate-600">
          <div>
            Hiển thị <strong>{tickets.length}</strong> / <strong>{pagination.total}</strong> kết quả (Trang {pagination.page}/{pagination.totalPages || 1})
          </div>

          <div className="flex items-center gap-3">
            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-1.5">
              <span>Hiển thị:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Prev & Next Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold disabled:opacity-40 transition-all cursor-pointer"
              >
                Trước
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold disabled:opacity-40 transition-all cursor-pointer"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Reply Modal */}
      <AdminContactTicketReplyModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteTicket(deletingId);
            setDeletingId(null);
          }
        }}
        title="Xác nhận xóa phiếu hỗ trợ"
        description="Bạn có chắc chắn muốn xóa phiếu hỗ trợ này không? Thao tác này không thể hoàn tác."
      />
    </div>
  );
};
