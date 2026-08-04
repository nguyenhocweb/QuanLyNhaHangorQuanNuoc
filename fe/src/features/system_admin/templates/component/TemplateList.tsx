"use client";

import React, { useState } from "react";
import { useGetTemplates, useDeleteTemplate } from "../hook/useTemplate";
import { ITemplate } from "../type/template.type";
import { TemplateFormModal } from "./TemplateFormModal";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { FaEdit, FaTrash, FaCheckCircle, FaLock, FaPalette, FaPlus, FaImage, FaEye } from "react-icons/fa";
import { FiMonitor, FiTablet, FiSmartphone, FiX } from "react-icons/fi";
import { cn } from "@/src/core/lib/tw";

export const TemplateList = () => {
    const [activeTab, setActiveTab] = useState<"BRAND_TEMPLATE" | "RESTAURANT_TEMPLATE">("BRAND_TEMPLATE");
    const { data, isLoading } = useGetTemplates(activeTab);
    const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteTemplate();

    const templates = data?.metadata || [];

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<ITemplate | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<ITemplate | null>(null);
    const [previewDevice, setPreviewDevice] = useState<"DESKTOP" | "MOBILE" | "TABLET">("DESKTOP");

    const handleEdit = (template: ITemplate) => {
        setEditingTemplate(template);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setEditingTemplate(null);
        setIsFormOpen(false);
    };

    const handleDelete = () => {
        if (deletingId) {
            deleteTemplate(deletingId, {
                onSuccess: () => setDeletingId(null)
            });
        }
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Header Area */}
            <FadeIn>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FaPalette className="text-indigo-600" /> Quản lý Mẫu Giao Diện
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Quản lý giao diện dành cho Thương hiệu và Nhà hàng</p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all flex items-center gap-2"
                    >
                        <FaPlus /> Thêm mẫu mới
                    </button>
                </div>
            </FadeIn>

            {/* Tabs */}
            <FadeIn delay={0.1}>
                <div className="flex items-center gap-2 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("BRAND_TEMPLATE")}
                        className={`px-5 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === "BRAND_TEMPLATE" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                        Thương hiệu
                    </button>
                    <button
                        onClick={() => setActiveTab("RESTAURANT_TEMPLATE")}
                        className={`px-5 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === "RESTAURANT_TEMPLATE" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                    >
                        Nhà hàng (Chi nhánh)
                    </button>
                </div>
            </FadeIn>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    // Skeletons
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="bg-white h-72 rounded-2xl animate-pulse shadow-sm border border-gray-100"></div>
                    ))
                ) : templates.length === 0 ? (
                    <div className="col-span-full bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <FaPalette />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Chưa có mẫu nào</h3>
                        <p className="text-gray-500 mt-1">Hãy tạo mẫu giao diện đầu tiên cho hệ thống.</p>
                    </div>
                ) : (
                    templates.map((item, index) => (
                        <FadeIn key={item.id} delay={0.1 * (index % 10)}>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group flex flex-col h-full relative">

                                {/* Status Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    {item.isActive ? (
                                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1 shadow-sm">
                                            <FaCheckCircle /> Hoạt động
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1 shadow-sm">
                                            <FaLock /> Khóa
                                        </span>
                                    )}
                                </div>

                                {/* Thumbnail */}
                                <div className="w-full h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center group-hover:bg-gray-200 transition-all">
                                    {item.thumbnailUrl ? (
                                        <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                    ) : (
                                        <FaImage className="text-5xl text-gray-300" />
                                    )}

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                                        <button
                                            onClick={() => { setPreviewTemplate(item); setPreviewDevice("DESKTOP"); }}
                                            className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center hover:scale-110 shadow-lg transition-all"
                                            title="Xem trước"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center hover:scale-110 shadow-lg transition-all"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => setDeletingId(item.id)}
                                            className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 hover:bg-red-600 shadow-lg transition-all"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{item.name}</h3>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg whitespace-nowrap">
                                            #{item.code}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 flex-1 mb-4">
                                        {item.description || "Chưa có mô tả"}
                                    </p>

                                    <div className="mt-auto flex flex-col gap-2 border-t border-gray-100 pt-4">
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Yêu cầu gói cước:</span>
                                            {item.allowedPlanIds && item.allowedPlanIds.length > 0 ? (
                                                <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Premium</span>
                                            ) : (
                                                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Miễn phí</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))
                )}
            </div>

            {/* Modals */}
            <TemplateFormModal
                open={isFormOpen}
                onClose={handleCloseForm}
                template={editingTemplate}
            />

            <ConfirmModal
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={handleDelete}
                title="Xác nhận xoá Mẫu giao diện"
                content="Bạn có chắc chắn muốn xoá mẫu này không? Thao tác này không thể hoàn tác. Nếu mẫu này đang được sử dụng, hệ thống sẽ báo lỗi. (Khuyên dùng: Sửa và Đổi trạng thái thành Khóa thay vì xoá cứng)."
            />

            {/* Preview Modal Overlay */}
            {previewTemplate && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[24px] overflow-hidden flex flex-col shadow-2xl">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FaEye className="text-indigo-500" /> Xem trước: {previewTemplate.name}
                            </h3>

                            {/* Device Tabs */}
                            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setPreviewDevice("DESKTOP")}
                                    className={cn("p-2 sm:px-4 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all", previewDevice === "DESKTOP" ? "bg-white text-indigo-600 shadow" : "text-gray-500 hover:text-gray-700")}
                                >
                                    <FiMonitor className="text-lg" /> <span className="hidden sm:inline">Máy tính</span>
                                </button>
                                <button
                                    onClick={() => setPreviewDevice("TABLET")}
                                    className={cn("p-2 sm:px-4 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all", previewDevice === "TABLET" ? "bg-white text-indigo-600 shadow" : "text-gray-500 hover:text-gray-700")}
                                >
                                    <FiTablet className="text-lg" /> <span className="hidden sm:inline">Máy tính bảng</span>
                                </button>
                                <button
                                    onClick={() => setPreviewDevice("MOBILE")}
                                    className={cn("p-2 sm:px-4 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all", previewDevice === "MOBILE" ? "bg-white text-indigo-600 shadow" : "text-gray-500 hover:text-gray-700")}
                                >
                                    <FiSmartphone className="text-lg" /> <span className="hidden sm:inline">Điện thoại</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                            >
                                <FiX className="text-2xl" />
                            </button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-6 sm:p-10 flex flex-col items-center">
                            {(() => {
                                const images = previewDevice === "DESKTOP" ? (previewTemplate.desktopImages || [])
                                    : previewDevice === "TABLET" ? (previewTemplate.tabletImages || [])
                                        : (previewTemplate.mobileImages || []);

                                if (!images || images.length === 0) {
                                    return (
                                        <div className="m-auto flex flex-col items-center justify-center text-gray-400">
                                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                                {previewDevice === "DESKTOP" ? <FiMonitor className="text-4xl" /> : previewDevice === "TABLET" ? <FiTablet className="text-4xl" /> : <FiSmartphone className="text-4xl" />}
                                            </div>
                                            <p className="italic font-medium">Chưa có ảnh xem trước cho thiết bị này.</p>
                                        </div>
                                    );
                                }

                                return (
                                    <div className={cn(
                                        "w-full flex flex-col gap-10",
                                        previewDevice === "DESKTOP" ? "max-w-5xl" : previewDevice === "TABLET" ? "max-w-2xl" : "max-w-sm"
                                    )}>
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/60 bg-white">
                                                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-auto object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
