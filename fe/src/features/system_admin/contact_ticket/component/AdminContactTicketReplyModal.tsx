"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaTimes,
  FaHeadset,
  FaPhoneAlt,
  FaEnvelope,
  FaCheckCircle,
  FaStickyNote,
  FaReply,
  FaUserCheck,
  FaSpinner,
  FaMagic
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { IAdminContactTicket, TicketStatus, TicketPriority } from "../type/contact_ticket_admin.type";
import { useUpdateAdminContactTicket } from "../hook/useUpdateAdminContactTicket";

interface AdminContactTicketReplyModalProps {
  ticket: IAdminContactTicket | null;
  isOpen: boolean;
  onClose: () => void;
}

const TICKET_REPLY_TEMPLATES = [
  {
    label: "📞 Đã liên hệ qua điện thoại/Zalo",
    text: "Đội ngũ CSKH đã liên hệ trực tiếp qua điện thoại/Zalo để tư vấn và giải đáp chi tiết cho quý khách."
  },
  {
    label: "📑 Đã gửi tài liệu & Báo giá qua Email",
    text: "Chào bạn, NVNguyen đã gửi bảng báo giá giải pháp chi tiết và tài liệu hướng dẫn vào địa chỉ email của bạn. Vui lòng kiểm tra hòm thư nhé!"
  },
  {
    label: "🔧 Kỹ thuật đã xử lý xong sự cố",
    text: "Vấn đề kỹ thuật của bạn đã được đội ngũ lập trình kiểm tra và khắc phục hoàn tất trên hệ thống."
  }
];

export const AdminContactTicketReplyModal: React.FC<AdminContactTicketReplyModalProps> = ({
  ticket,
  isOpen,
  onClose
}) => {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<TicketStatus>("OPEN");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [assignedTo, setAssignedTo] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [adminReply, setAdminReply] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status || "OPEN");
      setPriority(ticket.priority || "MEDIUM");
      setAssignedTo(ticket.assignedTo || "");
      setAdminNote(ticket.adminNote || "");
      setAdminReply(ticket.adminReply || "");
    }
  }, [ticket, isOpen]);

  const { mutate: updateTicket, isPending } = useUpdateAdminContactTicket(onClose);

  if (!isOpen || !ticket || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTicket({
      id: ticket.id,
      payload: {
        status,
        priority,
        assignedTo: assignedTo.trim() || null,
        adminNote: adminNote.trim() || null,
        adminReply: adminReply.trim() || null
      }
    });
  };

  const cleanPhone = ticket.guestPhone ? ticket.guestPhone.replace(/\D/g, "") : "";

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
      <FadeIn isFirstFolder={true} className="w-full max-w-2xl my-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <FaHeadset className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base">Xử Lý Phiếu Hỗ Trợ</h3>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
                    {ticket.ticketCode}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Gửi lúc: {new Date(ticket.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Ticket Body Details */}
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Customer Info Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">{ticket.guestName}</span>
                  {ticket.hasZalo && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                      <SiZalo className="w-3 h-3" /> Có Zalo
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {ticket.guestPhone && (
                    <a
                      href={`tel:${cleanPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-all"
                    >
                      <FaPhoneAlt className="w-3 h-3 text-emerald-600" />
                      <span>{ticket.guestPhone}</span>
                    </a>
                  )}
                  {ticket.hasZalo && cleanPhone && (
                    <a
                      href={`https://zalo.me/${cleanPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold transition-all"
                    >
                      <SiZalo className="w-3 h-3 text-blue-600" />
                      <span>Chat Zalo</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <FaEnvelope className="w-3.5 h-3.5 text-slate-400" />
                <a href={`mailto:${ticket.guestEmail}`} className="text-indigo-600 font-semibold hover:underline">
                  {ticket.guestEmail}
                </a>
              </div>

              {ticket.subject && (
                <div className="text-xs font-bold text-slate-800 pt-1">
                  Chủ đề: <span className="font-medium text-slate-700">{ticket.subject}</span>
                </div>
              )}

              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-medium">
                "{ticket.message}"
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Status & Priority & Assignee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái xử lý</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TicketStatus)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  >
                    <option value="OPEN">🟡 Mới tiếp nhận (OPEN)</option>
                    <option value="PROCESSING">🔵 Đang xử lý (PROCESSING)</option>
                    <option value="RESOLVED">🟢 Đã giải quyết (RESOLVED)</option>
                    <option value="CLOSED">⚫ Đã đóng (CLOSED)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức độ ưu tiên</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  >
                    <option value="LOW">Thấp (LOW)</option>
                    <option value="MEDIUM">Trung bình (MEDIUM)</option>
                    <option value="HIGH">Cao (HIGH)</option>
                    <option value="URGENT">Khẩn cấp (URGENT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Người phụ trách</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="VD: Nguyễn Văn Nguyên"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  />
                </div>
              </div>

              {/* Quick Reply Templates */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                  <FaMagic className="w-3 h-3 text-amber-500" />
                  <span>Mẫu nội dung xử lý nhanh (1-Click):</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TICKET_REPLY_TEMPLATES.map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAdminReply(tpl.text)}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 transition-all cursor-pointer text-left"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Public/Sent Reply */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <FaReply className="w-3 h-3 text-indigo-600 rotate-180" />
                  <span>Nội dung phản hồi khách hàng (Ghi lại kết quả)</span>
                </label>
                <textarea
                  rows={2}
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  placeholder="Ghi lại nội dung đã phản hồi hoặc hướng dẫn cho khách..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                />
              </div>

              {/* Internal Note */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <FaStickyNote className="w-3 h-3 text-amber-500" />
                  <span>Ghi chú nội bộ CSKH (Chỉ quản trị viên thấy)</span>
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Ghi chú tiến độ, thông tin bổ sung giữa các nhân viên..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isPending && <FaSpinner className="w-3 h-3 animate-spin" />}
                  <span>{isPending ? "Đang lưu..." : "Cập Nhật Phiếu Hỗ Trợ"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </FadeIn>
    </div>,
    document.body
  );
};
