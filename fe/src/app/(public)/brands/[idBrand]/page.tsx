"use client";

import React, { use, useState } from "react";
import { usePublicBrand_hook } from "@/src/features/public/brands/brands_hook/usePublicBrand_hook";
import Loading from "@/src/core/components/layout/public-loading";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import TemplateRenderer from "@/src/features/public/brands/components/brand-detail/TemplateRenderer";
import { BrandTemplateTheme } from "@/src/core/lib/configTemplates";
import ThemeSwitcher from "@/src/features/public/brands/components/brand-detail/ThemeSwitcher";

const BrandItem = ({ params }: { params: Promise<{ idBrand: string }> }) => {
    const { idBrand } = use(params);
    const { data, isLoading, isFetched } = usePublicBrand_hook(idBrand);
    
    // Khởi tạo state nhưng sẽ cập nhật lại khi có data
    const [currentTheme, setCurrentTheme] = useState<BrandTemplateTheme>("standard");

    // Khi có data, cập nhật theme nếu brand có liên kết template
    React.useEffect(() => {
        const brandData: any = data?.data || data;
        const templateCode = brandData?.template?.code;
        if (templateCode) {
            // Ép kiểu sang BrandTemplateTheme (ví dụ code là "premium3d" hoặc "modern")
            setCurrentTheme(templateCode as BrandTemplateTheme);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-slate-950">
                <Loading />
            </div>
        );
    }

    if (isFetched && !data) {
        return (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-3xl">
                    <FaExclamationTriangle />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white">
                    Không tìm thấy thương hiệu này!
                </h2>
                <p className="text-sm text-gray-500 max-w-md">
                    Thương hiệu bạn đang tìm kiếm có thể đã tạm dừng hoạt động hoặc đường dẫn không hợp lệ trên hệ thống NVNguyen.
                </p>
                <Link
                    href="/brands"
                    className="mt-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg transition-all"
                >
                    Quay lại danh sách Thương hiệu
                </Link>
            </div>
        );
    }

    const brandData = data?.data || data;
    
    return (
        <>
            <TemplateRenderer theme={currentTheme} data={brandData} idBrand={idBrand} />
            <ThemeSwitcher currentTheme={currentTheme} onChangeTheme={setCurrentTheme} />
        </>
    );
};

export default BrandItem;