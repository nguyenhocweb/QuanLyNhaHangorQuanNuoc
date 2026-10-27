"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaReply, FaStickyNote, FaCheck, FaEraser, FaMagic } from "react-icons/fa";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { IAdminWebFeedback } from "../type/web_feedback_admin.type";
import { useUpdateAdminWebFeedback } from "../hook/useUpdateAdminWebFeedback";

interface AdminFeedbackReplyModalProps {
  feedback: IAdminWebFeedback | null;
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_REPLY_TEMPLATES = [
  {
    label: "✨ Cảm ơn & Ghi nhận",
    text: "Chân thành cảm ơn bạn đã tin tưởng và đóng góp ý kiến quý báu! Đội ngũ phát triển đã ghi nhận và đang tiếp tục tối ưu hóa trải nghiệm tốt nhất."
  },
  {
    label: "🚀 Đã sửa & Khắc phục",
    text: "Cảm ơn bạn đã phản hồi! Đội ngũ kỹ thuật đã kiểm tra và khắc phục triệt để vấn đề này trong bản cập nhật mới nhất."
  },
  {
    label: "💡 Đưa vào Roadmap",
    text: "Ý kiến đóng góp của bạn rất hữu ích! Chúng tôi đã đưa vào lộ trình phát triển và hoàn thiện tính năng trong thời gian tới."
  },
  {
    label: "🎁 Tặng Voucher Tri ân",
    text: "Chân thành cảm ơn bạn đã đồng hành! Ban Quản Trị đã gửi tặng mã ưu đãi đặc quyền VIP vào tài khoản để tri ân sự đóng góp của bạn."
  }
];

export const AdminFeedbackReplyModal: React.FC<AdminFeedbackReplyModalProps> = ({
  feedback,
  isOpen,
  onClose
}) => {
  const [mounted, setMounted] = useState(false);
  const [adminReply, setAdminReply] = useState("");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (feedback) {
      // Nếu đã có phản hồi cũ thì load, nếu chưa có thì ĐIỀN SẴN mẫu mặc định để admin bấm lưu là xong ngay
      if (feedback.adminReply && feedback.adminReply.trim()) {
        setAdminReply(feedback.adminReply);
      } else {
        const guest = feedback.guestName ? `${feedback.guestName} ` : "";
        setAdminReply(
          `Chân thành cảm ơn bạn ${guest}đã tin tưởng và đóng góp ý kiến quý báu! Đội ngũ phát triển đã ghi nhận và đang tiếp tục tối ưu hóa trải nghiệm.`
        );
      }
      setAdminNote(feedback.adminNote || "");
    }
  }, [feedback, isOpen]);

  const { mutate: updateFeedback, isPending } = useUpdateAdminWebFeedback();

  if (!isOpen || !feedback || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFeedback(
      {
        id: feedback.id,
        payload: {
          adminReply: adminReply.trim() || undefined,
          adminNote: adminNote.trim() || undefined
        }
      },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <FadeIn isFirstFolder={true} className="w-full max-w-xl my-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <FaReply className="w-4 h-4 rotate-180" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Phản Hồi & Ghi Chú Đánh Giá</h3>
                <p className="text-xs text-slate-300">Phản hồi sẽ hiển thị công khai dưới nhận xét của khách</p>
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

          {/* User Review Summary */}
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200/80 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{feedback.guestName || "Khách ẩn danh"}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold">
                  {feedback.category}
                </span>
              </div>
              <span className="text-amber-500 font-black text-sm">⭐ {feedback.rating}/5</span>
            </div>
            <p className="text-slate-700 italic leading-relaxed line-clamp-3 bg-white p-3 rounded-xl border border-slate-200/60">
              "{feedback.content}"
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Quick Templates 1-Click */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <FaMagic className="w-3 h-3 text-amber-500" />
                  <span>Chọn mẫu câu trả lời nhanh (1-Click):</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAdminReply("")}
                  className="text-[11px] text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <FaEraser className="w-2.5 h-2.5" /> Xóa trắng để viết lại
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REPLY_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAdminReply(tpl.text)}
                    className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 transition-all cursor-pointer text-left"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Public Reply Textarea (Pre-filled directly into value) */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                <FaReply className="w-3 h-3 text-indigo-600 rotate-180" />
                <span>Nội dung phản hồi công khai (Có sẵn nội dung mẫu)</span>
              </label>
              <textarea
                rows={3}
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                placeholder="Nhập nội dung phản hồi công khai cho khách hàng..."
                className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all leading-relaxed font-medium text-slate-800"
              />
            </div>

            {/* Internal Admin Note */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                <FaStickyNote className="w-3 h-3 text-amber-500" />
                <span>Ghi chú nội bộ (Chỉ quản trị viên thấy)</span>
              </label>
              <textarea
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Ghi chú nội bộ (Ví dụ: Đã giao task cho team FE sửa, Đã gửi email voucher)..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">Bấm lưu để cập nhật tức thì</span>
              <div className="flex items-center gap-3">
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
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
                >
                  <FaCheck className="w-3 h-3" />
                  <span>{isPending ? "Đang lưu..." : "Phản Hồi & Lưu Ngay"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </FadeIn>
    </div>,
    document.body
  );
};
