"use client";

import React from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaUtensils, FaRocket, FaShieldAlt, FaUsers, FaLightbulb, FaHeart, FaAward } from "react-icons/fa";
import { WebAuthorsSection } from "@/src/features/public/web_author/component/WebAuthorsSection";

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
      {/* Hero Banner */}
      <section className="w-full py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto text-center relative overflow-hidden">
        <FadeIn isFirstFolder={true}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-4">
            <FaUtensils className="w-3.5 h-3.5" />
            <span>Câu Chuyện Thương Hiệu NVNguyen</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
            Kiến Tạo Tương Lai Cho Ngành <span className="text-orange-600">Ẩm Thực & F&B</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed font-medium">
            NVNguyen là nền tảng quản lý và trải nghiệm ẩm thực toàn diện, kết nối thực khách với hàng trăm thương hiệu nhà hàng danh tiếng thông qua công nghệ hiện đại.
          </p>
        </FadeIn>
      </section>

      {/* Core Values Grid */}
      <section className="w-full py-12 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <FadeIn isFirstFolder={true}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl mb-5 shadow-xs">
                <FaRocket className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tốc Độ & Hiệu Năng</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tối ưu hóa quy trình gọi món, đặt bàn và thanh toán chỉ trong vài giây với kiến trúc Real-time phân tán.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-5 shadow-xs">
                <FaShieldAlt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Bảo Mật & Chuẩn Mực</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Bảo vệ dữ liệu khách hàng và dòng tiền nhà hàng với chuẩn bảo mật ngân hàng và mã hóa đa lớp.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-5 shadow-xs">
                <FaHeart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tận Tâm Vì Khách Hàng</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Lắng nghe từng đóng góp và liên tục cải tiến hệ thống để mang lại nụ cười trọn vẹn cho từng bữa tiệc.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Engineering Team Section */}
      <WebAuthorsSection />
    </div>
  );
}
