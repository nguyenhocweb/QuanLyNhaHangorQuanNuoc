"use client";
import React, { useState, useEffect } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import AutoImageCarousel from "@/src/core/components/animation/AutoImageCarousel";
import { Div, H, P, Button } from "@/src/core/components/ui";
import { FiArrowLeft, FiStar, FiMapPin } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useGetRestaurantById } from "../hook/useGetRestaurantById";

import BranchOverviewTab from "./tabs/BranchOverviewTab";
import BranchUtilitiesTab from "./tabs/BranchUtilitiesTab";
import BranchEmployeesTab from "./tabs/BranchEmployeesTab";
import BranchTablesTab from "./tabs/BranchTablesTab";
import BranchMenuTab from "./tabs/BranchMenuTab";
import OperatingHoursTab from "../../operating_hours/component/OperatingHoursTab";

interface BranchDetailProps {
    id: string;
}

const BranchDetail: React.FC<BranchDetailProps> = ({ id }) => {
    const router = useRouter();
    const user = useAuthStore(state => state.user);
    const id_brand = user?.brand?.find((b: any) => b?.isSelect || b?.isSlect)?.id || user?.brand?.find((b: any) => b?.id)?.id || "";
    
    const { data: branch, isLoading } = useGetRestaurantById(id_brand, id);
    const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'tables' | 'menu' | 'utilities' | 'operating_hours'>('overview');

    const galleryImages = React.useMemo(() => {
        if (!branch) return [];
        const imgs = [];
        if (branch.imageMain) imgs.push(branch.imageMain);
        if (branch.images && Array.isArray(branch.images)) {
            imgs.push(...branch.images);
        }
        if (imgs.length === 0) imgs.push("https://res.cloudinary.com/demo/image/upload/v1612847525/sample.jpg");
        return [...new Set(imgs)]; // Loại bỏ ảnh trùng lặp
    }, [branch]);

    if (isLoading) {
        return (
            <Div className="p-10 justify-center items-center w-full min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </Div>
        );
    }

    if (!branch) {
        return (
            <Div vitri="col_none" className="items-center justify-center p-20 w-full min-h-[50vh]">
                <H className="text-xl font-bold text-gray-700">Không tìm thấy chi nhánh</H>
                <Button variant="green" className="mt-4" onClick={() => router.push("/brand_owner/restaurants")}>Quay lại danh sách</Button>
            </Div>
        );
    }

    return (
        <Div vitri="col_none" className="w-full relative min-w-0 max-w-full" gap="g4_5">
            {/* Header / Cover */}
            <Div vitri="col_none" className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative group">
                <div className="h-64 md:h-80 lg:h-[400px] w-full relative bg-gray-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-80">
                        <AutoImageCarousel images={galleryImages} alt={`${branch?.name || 'Chi nhánh'} cover`} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent pointer-events-none z-10"></div>
                    
                    {/* Back Button */}
                    <button 
                        onClick={() => router.push("/brand_owner/restaurants")}
                        className="absolute top-6 left-6 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-10"
                    >
                        <FiArrowLeft className="text-xl" />
                    </button>
                    
                    {/* Cover Actions */}
                    <div className="absolute top-6 right-6 flex gap-3 z-10">
                        <span className={`px-4 py-1.5 text-sm font-bold tracking-wide rounded-full shadow-lg backdrop-blur-md border border-white/20 ${branch.statusByBrand === 'ACTIVE' ? 'bg-green-500/90 text-white' : 'bg-gray-600/90 text-white'}`}>
                            {branch.statusByBrand === 'ACTIVE' ? 'ĐANG HOẠT ĐỘNG' : 'TẠM DỪNG'}
                        </span>
                    </div>

                    {/* Main Title Info */}
                    <div className="absolute bottom-6 left-8 flex items-end gap-6 z-20">
                        {/* Logo */}
                        <div className="w-28 h-28 rounded-2xl bg-white p-1.5 shadow-2xl z-10">
                            <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                                {branch.logo ? (
                                    <img src={branch.logo} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-black text-gray-300">{branch.name?.charAt(0)}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col mb-2 text-white">
                            <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">{branch.name}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-orange-400 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                    <FiStar className="fill-orange-400" />
                                    <span className="font-bold">{branch.averageRating?.toFixed(1) || "0.0"}</span>
                                </span>
                                <span className="text-gray-200 text-sm font-medium flex items-center gap-1.5 drop-shadow-md">
                                    <FiMapPin /> {[branch.address?.street, branch.address?.ward, branch.address?.district, branch.address?.city || (branch.address as any)?.province].filter(Boolean).join(", ")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex px-8 border-t border-gray-100/10 bg-white">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        Tổng quan
                    </button>
                    <button 
                        onClick={() => setActiveTab('employees')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'employees' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        Nhân sự
                    </button>
                    <button 
                        onClick={() => setActiveTab('tables')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'tables' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        Sơ đồ bàn
                    </button>
                    <button 
                        onClick={() => setActiveTab('menu')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'menu' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        Thực đơn
                    </button>
                    <button 
                        onClick={() => setActiveTab('utilities')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'utilities' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        Tiện ích & Danh mục
                    </button>
                    <button 
                        onClick={() => setActiveTab('operating_hours')}
                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'operating_hours' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        Giờ hoạt động
                    </button>
                </div>
            </Div>

            {/* Tab Contents */}
            <div className="w-full mt-4 min-w-0">
                {activeTab === 'overview' && <BranchOverviewTab branch={branch} id_brand={id_brand} />}
                {activeTab === 'employees' && <BranchEmployeesTab id_brand={id_brand} restaurantId={id} />}
                {activeTab === 'tables' && <BranchTablesTab />}
                {activeTab === 'menu' && <BranchMenuTab id_brand={id_brand} restaurantId={id} />}
                {activeTab === 'utilities' && <BranchUtilitiesTab id_brand={id_brand} id={id} />}
                {activeTab === 'operating_hours' && <OperatingHoursTab id_brand={id_brand} idRestaurant={id} />}
            </div>
        </Div>
    );
};

export default BranchDetail;
