"use client";
import FadeIn from "@/src/core/components/animation/FadeIn";
import React, { useState } from "react";
import { usePaymentMethods, useDeletePaymentMethod } from "../hook/usePayment";
import { PaymentConfigSlideOver } from "./PaymentConfigSlideOver";
import { SystemPaymentMethod } from "../type/payment.type";
import { FiCheckCircle, FiXCircle, FiSettings, FiPlus, FiTrash2 } from "react-icons/fi";
import { MdPayment } from "react-icons/md";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";

export const PaymentMethodList = () => {
    const { data: methods, isLoading } = usePaymentMethods();
    const [selectedMethod, setSelectedMethod] = useState<SystemPaymentMethod | null>(null);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { mutate: deleteMethod, isPending: isDeleting } = useDeletePaymentMethod();

    return (
        <FadeIn>
        <div className="p-6 max-w-7xl mx-auto space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MdPayment className="text-indigo-600" /> Quản lý Phương thức thanh toán
                    </h2>
                    <p className="text-gray-500 mt-1">Quản lý và cấu hình các cổng thanh toán khả dụng trên toàn hệ thống</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                        onClick={() => {
                            setSelectedMethod(null);
                            setIsSlideOverOpen(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center"
                    >
                        <FiPlus /> Thêm phương thức
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 text-center text-gray-500 animate-pulse">Đang tải danh sách phương thức...</div>
                ) : methods?.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                        Chưa có phương thức thanh toán nào trong hệ thống.
                    </div>
                ) : (
                    methods?.map((method) => (
                        <div 
                            key={method.id} 
                            onClick={() => {
                                setSelectedMethod(method);
                                setIsSlideOverOpen(true);
                            }}
                            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center p-3 shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                    {method.iconUrl ? (
                                        <img src={method.iconUrl} alt={method.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <MdPayment className="text-3xl text-gray-400" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${method.isActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                            {method.isActive ? <><FiCheckCircle /> Đang bật</> : <><FiXCircle /> Đã tắt</>}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeletingId(method.id);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Xóa phương thức"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{method.name}</h3>
                                <div className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded inline-block mt-2 mb-2">
                                    {method.code}
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                    {method.description || "Chưa có mô tả..."}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs text-indigo-600 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    <FiSettings /> Nhấn để cấu hình
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <PaymentConfigSlideOver 
                isOpen={isSlideOverOpen}
                onClose={() => setIsSlideOverOpen(false)}
                method={selectedMethod}
                allMethods={methods}
            />

            <ConfirmModal
                open={!!deletingId}
                title="Xóa phương thức thanh toán"
                content="Bạn có chắc chắn muốn xóa phương thức thanh toán này không? Thao tác này không thể hoàn tác và có thể ảnh hưởng đến giao dịch hiện tại."
                type="danger"
                isLoading={isDeleting}
                confirmText="Xóa phương thức"
                cancelText="Hủy"
                onClose={() => setDeletingId(null)}
                onConfirm={() => {
                    if (deletingId) {
                        deleteMethod(deletingId, {
                            onSuccess: () => setDeletingId(null)
                        });
                    }
                }}
            />
        </div>
        </FadeIn>
    );
};
