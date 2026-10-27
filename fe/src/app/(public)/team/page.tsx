import React from "react";
import { Metadata } from "next";
import { WebAuthorsSection } from "@/src/features/public/web_author/component/WebAuthorsSection";
import FadeIn from "@/src/core/components/animation/FadeIn";

export const metadata: Metadata = {
  title: "Đội Ngũ Kỹ Sư & Tác Giả | NVNguyen Restaurant Platform",
  description: "Gặp gỡ đội ngũ kỹ sư phần mềm và kiến trúc sư phát triển nền tảng quản lý nhà hàng F&B toàn diện."
};

export default function PublicTeamPage() {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <FadeIn isFirstFolder={true}>
          <nav className="text-xs text-gray-400 flex items-center gap-2">
            <a href="/" className="hover:text-orange-400 transition-colors">Trang chủ</a>
            <span>/</span>
            <span className="text-white font-semibold">Đội ngũ phát triển</span>
          </nav>
        </FadeIn>
      </div>

      <WebAuthorsSection />
    </div>
  );
}
