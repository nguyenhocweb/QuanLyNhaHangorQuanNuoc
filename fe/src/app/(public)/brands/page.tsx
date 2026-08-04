"use client";

import React, { Suspense } from "react";
import PublicBrands from "@/src/core/components/layout/public-brands";
import BrandFilterBar from "@/src/features/public/brands/components/BrandFilterBar";
import FeaturedBrandComponent from "@/src/features/public/brands/components/featured-brands-components";
import Loading from "@/src/core/components/layout/public-loading";
import FadeIn from "@/src/core/components/animation/FadeIn";
import Brand3DBackground from "@/src/features/public/brands/components/brand-3d-background";

const BrandPage: React.FC = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Brand3DBackground>
                <main className="w-full pb-20 flex flex-col gap-8">
                    {/* 1. Hero Section 3D VIP */}
                    <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
                        <PublicBrands />
                    </div>

                    {/* 2. Floating Glassmorphism Filter & Search Toolbar */}
                    <div className="relative z-20">
                        <BrandFilterBar />
                    </div>

                    {/* 3. Danh sách Thương hiệu 3D & Phân trang */}
                    <FadeIn delay={0.2} className="w-full">
                        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 w-full">
                            <FeaturedBrandComponent type="page" />
                        </section>
                    </FadeIn>
                </main>
            </Brand3DBackground>
        </Suspense>
    );
};

export default BrandPage;