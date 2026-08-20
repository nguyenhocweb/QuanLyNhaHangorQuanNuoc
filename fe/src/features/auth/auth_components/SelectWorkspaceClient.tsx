"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../auth_store/use-auth-store";
import { motion, Variants } from "framer-motion";
import { FaStore, FaBuilding, FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { toast } from "sonner";

export default function SelectWorkspaceClient() {
    const { user, isAuthenticated, switchWorkspace, logout } = useAuthStore();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!isAuthenticated || !user) {
            router.push("/login");
        }
    }, [isAuthenticated, user, router]);

    if (!isClient || !user) return null;

    const brands = user.brand || [];
    const restaurants = user.restaurant || [];

    const handleSelectWorkspace = (type: "BRAND" | "RESTAURANT", workspace: any) => {
        switchWorkspace({
            type,
            id: workspace.id,
            name: workspace.name,
            role: workspace.role
        });

        toast.success(`Đã vào không gian: ${workspace.name}`);

        if (type === "BRAND") {
            router.push("/brand_owner/dashboard");
        } else {
            if (workspace.role === "Quản lý nhà hàng") {
                router.push("/quan-ly-nha-hang/dashboard");
            } else {
                router.push("/quan-ly-nha-hang/profile");
            }
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-10">
                <FadeIn delay={0.1}>
                    <h1 className="text-3xl font-bold text-slate-800 mb-3">Chào mừng trở lại, {user.name}</h1>
                    <p className="text-slate-500">Bạn có nhiều không gian làm việc. Vui lòng chọn một nơi để bắt đầu.</p>
                </FadeIn>
            </div>

            <motion.div 
                className="space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Brands Section */}
                {brands.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2 px-2">
                            <FaBuilding className="text-indigo-500" />
                            Quản trị Thương hiệu
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {brands.map((brand: any) => (
                                <motion.div key={`brand-${brand.id}`} variants={itemVariants}>
                                    <button
                                        onClick={() => handleSelectWorkspace("BRAND", brand)}
                                        className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 hover:ring-1 hover:ring-indigo-100 transition-all duration-200 text-left group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                                                <FaBuilding className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800 text-lg mb-1">{brand.name}</h3>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                    {brand.role}
                                                </span>
                                            </div>
                                        </div>
                                        <FaChevronRight className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Restaurants Section */}
                {restaurants.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2 px-2">
                            <FaStore className="text-emerald-500" />
                            Chi nhánh Nhà hàng
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {restaurants.map((rest: any) => (
                                <motion.div key={`rest-${rest.id}`} variants={itemVariants}>
                                    <button
                                        onClick={() => handleSelectWorkspace("RESTAURANT", rest)}
                                        className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-100 hover:ring-1 hover:ring-emerald-100 transition-all duration-200 text-left group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                                                <FaStore className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800 text-lg mb-1">{rest.name}</h3>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                    {rest.role}
                                                </span>
                                            </div>
                                        </div>
                                        <FaChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            <FadeIn delay={0.4} className="mt-12 text-center">
                <button 
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-red-600 transition-colors duration-200 shadow-sm"
                >
                    <FaSignOutAlt />
                    Đăng xuất
                </button>
            </FadeIn>
        </div>
    );
}
