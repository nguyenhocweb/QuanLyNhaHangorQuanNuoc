"use client";

import React from "react";
import { HomeHero3D } from "./home-sections/HomeHero3D";
import { HomeCategoryGrid } from "./home-sections/HomeCategoryGrid";
import { HomeFeaturedShowcase } from "./home-sections/HomeFeaturedShowcase";
import { HomeSocialProofMarquee } from "./home-sections/HomeSocialProofMarquee";
import { HomeCtaBanner } from "./home-sections/HomeCtaBanner";
import { BackgroundMesh3D } from "../animation/BackgroundMesh3D";

const PublicHome: React.FC = () => {
    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 flex flex-col relative selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            {/* Lớp nền 3D WebGL / 2D Pro Max toàn cảnh */}
            <BackgroundMesh3D />

            {/* Khối 1: Hero Section 3D Tinh hoa */}
            <HomeHero3D />

            {/* Khối 2: Danh mục Ẩm thực Thịnh hành */}
            <HomeCategoryGrid />

            {/* Khối 3: Showcase Nhà hàng, Thương hiệu & Món ăn Nổi bật */}
            <HomeFeaturedShowcase />

            {/* Khối 4: Dòng chảy Đánh giá Thực tế từ Khách hàng */}
            <HomeSocialProofMarquee />

            {/* Khối 5: Banner Kêu gọi Hành động (CTA) */}
            <HomeCtaBanner />
        </div>
    );
};

export default PublicHome;