"use client";

import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaHeadset,
  FaPaperPlane,
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaCopy,
  FaRedo
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { toast } from "sonner";
import { useCreateContactTicket } from "@/src/features/public/contact_ticket/hook/useCreateContactTicket";
import { ICreateContactTicketResponse } from "@/src/features/public/contact_ticket/type/contact_ticket.type";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hasZalo, setHasZalo] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [submittedTicket, setSubmittedTicket] = useState<ICreateContactTicketResponse | null>(null);

  const { mutate: submitTicket, isPending } = useCreateContactTicket((res) => {
    setSubmittedTicket(res);
    setName("");
    setEmail("");
    setPhone("");
    setHasZalo(false);
    setSubject("");
    setMessage("");
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Vui lòng điền họ tên, email và nội dung cần hỗ trợ!");
      return;
    }

    submitTicket({
      guestName: name.trim(),
      guestEmail: email.trim(),
      guestPhone: phone.trim() || undefined,
      hasZalo,
      subject: subject.trim() || undefined,
      message: message.trim(),
      deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : undefined
    });
  };

  const handleCopyCode = () => {
    if (submittedTicket?.ticketCode) {
      navigator.clipboard.writeText(submittedTicket.ticketCode);
      toast.success(`Đã sao chép mã phiếu: ${submittedTicket.ticketCode}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-16 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
      <FadeIn isFirstFolder={true}>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <FaHeadset className="w-3.5 h-3.5" />
            <span>Trung Tâm Hỗ Trợ Khách Hàng & Đối Tác</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Chúng Tôi Có Thể <span className="text-indigo-600">Giúp Gì Cho Bạn?</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Đội ngũ chuyên viên tư vấn và kỹ thuật sẵn sàng hỗ trợ giải đáp mọi thắc mắc của bạn 24/7.
          </p>
        </div>

        {/* Content 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 text-lg">
                <FaPhoneAlt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Hotline Tư Vấn & Hỗ Trợ</h4>
                <p className="text-xs text-slate-500 mt-0.5">Hỗ trợ đặt bàn và đối tác kinh doanh</p>
                <a href="tel:0935884541" className="text-base font-extrabold text-orange-600 mt-1 block hover:underline">
                  0935 884 541
                </a>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-lg">
                <SiZalo className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Kết Nối Zalo Trực Tiếp</h4>
                <p className="text-xs text-slate-500 mt-0.5">Nhắn tin trực tiếp với nhân viên CSKH</p>
                <a
                  href="https://zalo.me/0935884541"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-extrabold text-blue-600 mt-1 inline-flex items-center gap-1 hover:underline"
                >
                  Chat qua Zalo: 0935 884 541 →
                </a>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-lg">
                <FaEnvelope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Email Chăm Sóc Khách Hàng</h4>
                <p className="text-xs text-slate-500 mt-0.5">Tiếp nhận yêu cầu hợp tác & khiếu nại</p>
                <a href="mailto:nvnremix@gmail.com" className="text-sm font-extrabold text-emerald-600 mt-1 block hover:underline">
                  nvnremix@gmail.com
                </a>
              </div>
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center flex-shrink-0 text-lg">
                <FaClock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Thời Gian Tiếp Nhận</h4>
                <p className="text-xs text-slate-300 mt-0.5">Tổng đài hoạt động: 08:00 - 23:00</p>
                <span className="text-[11px] text-amber-400 font-semibold block mt-1">
                  Hệ thống gửi ticket trực tuyến ghi nhận 24/7
                </span>
              </div>
            </div>
          </div>

          {/* Right Contact Form Column / Success Confirmation */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md">
            {submittedTicket ? (
              <FadeIn isFirstFolder={true} className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
                  <FaCheckCircle className="w-9 h-9" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black text-slate-900">Gửi Yêu Cầu Thành Công!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Cảm ơn <strong>{submittedTicket.guestName}</strong>! Phiếu hỗ trợ của bạn đã được chuyển tới bộ phận chăm sóc khách hàng.
                  </p>
                </div>

                {/* Ticket Code Box */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Mã Tra Cứu Phiếu Hỗ Trợ Của Bạn
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-mono font-black text-indigo-600 bg-white px-4 py-1.5 rounded-xl border border-indigo-100 shadow-xs">
                      {submittedTicket.ticketCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all cursor-pointer"
                      title="Sao chép mã"
                    >
                      <FaCopy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Lưu lại mã này để đọc cho nhân viên tổng đài hoặc tra cứu khi cần.
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setSubmittedTicket(null)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <FaRedo className="w-3 h-3" />
                    <span>Gửi thêm yêu cầu hỗ trợ khác</span>
                  </button>
                </div>
              </FadeIn>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Gửi Yêu Cầu Hỗ Trợ</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Điền thông tin bên dưới, hệ thống sẽ tự động tạo mã ticket và phân công nhân viên xử lý nhanh nhất.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên của bạn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      required
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Địa chỉ Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        required
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Số điện thoại <span className="text-slate-400 font-normal">(Tùy chọn)</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0901234567"
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Checkbox Zalo */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasZalo}
                        onChange={(e) => setHasZalo(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                        <SiZalo className="w-4 h-4 text-blue-600" />
                        <span>Số điện thoại này có dùng Zalo (để CSKH tiện liên hệ phản hồi)</span>
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chủ đề cần tư vấn / hỗ trợ <span className="text-slate-400 font-normal">(Tùy chọn)</span>
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ví dụ: Cần tư vấn giải pháp Kiosk gọi món cho nhà hàng"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nội dung chi tiết <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mô tả chi tiết câu hỏi, thắc mắc hoặc vấn đề bạn đang gặp phải..."
                      required
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-60"
                  >
                    {isPending ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaPaperPlane className="w-4 h-4" />}
                    <span>{isPending ? "Đang gửi yêu cầu..." : "Gửi Phiếu Hỗ Trợ Ngay"}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
