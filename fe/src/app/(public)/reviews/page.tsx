import React from "react";
import { Metadata } from "next";
import { WebTestimonialsSection } from "@/src/features/public/web_feedback/component/WebTestimonialsSection";
import FadeIn from "@/src/core/components/animation/FadeIn";

export const metadata: Metadata = {
  title: "Đánh Giá & Nhận Xét Hệ Thống | NVNguyen Restaurant Platform",
  description: "Trung tâm tiếp nhận đánh giá, đóng góp ý kiến và phản hồi từ khách hàng và đối tác sử dụng hệ thống."
};

export default function PublicReviewsPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50/70 via-white to-gray-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn isFirstFolder={true}>
          <div className="mb-4">
            <nav className="text-xs text-gray-500 flex items-center gap-2">
              <a href="/" className="hover:text-orange-600 transition-colors">Trang chủ</a>
              <span>/</span>
              <span className="text-gray-900 font-semibold">Đánh giá hệ thống</span>
            </nav>
          </div>
        </FadeIn>
      </div>

      <WebTestimonialsSection />
    </div>
  );
}
