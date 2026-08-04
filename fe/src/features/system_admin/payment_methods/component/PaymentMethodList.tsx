"use client";
import FadeIn from "@/src/core/components/animation/FadeIn";
import React, { useState } from "react";
import { usePaymentMethods, useCreatePaymentMethod, useUpdatePaymentMethod, useDeletePaymentMethod } from "../hook/usePaymentMethod_hook";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { PaymentMethod, PaymentMethodFormData } from "../type/payment_method.type";
import { FiEdit2, FiTrash2, FiPlus, FiBookOpen } from "react-icons/fi";
import { MdPayment } from "react-icons/md";
import { ConfirmModal } from "../../../../core/components/layout/public-ConfirmModal";

export const PaymentMethodList = () => {
    const { data: methods, isLoading } = usePaymentMethods();
    const createMutation = useCreatePaymentMethod();
    const updateMutation = useUpdatePaymentMethod();
    const deleteMutation = useDeletePaymentMethod();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleOpenCreate = () => {
        setEditingMethod(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (method: PaymentMethod) => {
        setEditingMethod(method);
        setIsFormOpen(true);
    };

    const handleSubmit = async (data: PaymentMethodFormData) => {
        if (editingMethod) {
            await updateMutation.mutateAsync({ id: editingMethod.id, data });
        } else {
            await createMutation.mutateAsync(data);
        }
        setIsFormOpen(false);
    };

    const confirmDelete = async () => {
        if (deletingId) {
            await deleteMutation.mutateAsync(deletingId);
            setDeletingId(null);
        }
    };

    return (
        <FadeIn>
        <div className="p-6 max-w-7xl mx-auto space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MdPayment className="text-indigo-600" /> Quản lý Phương thức thanh toán
                    </h2>
                    <p className="text-gray-500 mt-1">Cấu hình các cổng thanh toán khả dụng trên toàn hệ thống</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <a
                        href="/system/payment-methods/docs"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center"
                    >
                        <FiBookOpen className="text-indigo-600" /> Hướng dẫn lấy API Key
                    </a>
                    <button
                        onClick={handleOpenCreate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center"
                    >
                        <FiPlus /> Thêm phương thức
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 text-center text-gray-500">Đang tải dữ liệu...</div>
                ) : methods?.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                        Chưa có phương thức thanh toán nào. Hãy thêm mới!
                    </div>
                ) : (
                    methods?.map((method) => (
                        <div key={method.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 shrink-0">
                                    {method.iconUrl ? (
                                        <img src={method.iconUrl} alt={method.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <MdPayment className="text-2xl text-gray-400" />
                                    )}
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${method.isActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                    {method.isActive ? 'Đang bật' : 'Đã tắt'}
                                </span>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{method.name}</h3>
                                <div className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded inline-block mt-1 mb-2">
                                    {method.code}
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                                    {method.description || "Chưa có mô tả..."}
                                </p>
                                
                                {/* Display System Config */}
                                {method.systemConfig && Object.keys(method.systemConfig).length > 0 && (
                                    <div className="mt-3 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs">
                                        {method.code === 'BANK_TRANSFER' ? (
                                            <div className="space-y-1">
                                                <div className="flex justify-between"><span className="text-gray-500">Ngân hàng:</span> <span className="font-medium text-gray-900">{method.systemConfig.bankName}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">Số TK:</span> <span className="font-medium text-gray-900">{method.systemConfig.accountNumber}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">Chủ TK:</span> <span className="font-medium text-gray-900">{method.systemConfig.accountName}</span></div>
                                            </div>
                                        ) : (method.code === 'MOMO' || method.code === 'ZALOPAY') ? (
                                            <div className="space-y-1">
                                                <div className="flex justify-between"><span className="text-gray-500">SĐT:</span> <span className="font-medium text-gray-900">{method.systemConfig.phoneNumber}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">Chủ TK:</span> <span className="font-medium text-gray-900">{method.systemConfig.accountName}</span></div>
                                            </div>
                                        ) : method.code === 'VNPAY' ? (
                                            <div className="space-y-1">
                                                <div className="flex justify-between"><span className="text-gray-500">Mã Terminal:</span> <span className="font-medium text-gray-900">{method.systemConfig.vnp_TmnCode || 'Chưa cấu hình'}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">Trạng thái API:</span> <span className="font-medium text-green-600">{method.systemConfig.vnp_HashSecret ? 'Đã liên kết' : 'Chưa liên kết'}</span></div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 italic">Có cấu hình hệ thống</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => handleOpenEdit(method)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    <FiEdit2 /> Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => setDeletingId(method.id)}
                                    className="flex items-center justify-center p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Xóa phương thức"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <PaymentMethodForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialData={editingMethod}
                onSubmit={handleSubmit}
                isPending={createMutation.isPending || updateMutation.isPending}
            />

            <ConfirmModal
                open={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Xóa phương thức thanh toán"
                content="Bạn có chắc chắn muốn xóa phương thức thanh toán này không? Hành động này có thể ảnh hưởng đến các cấu hình hiện tại."
                confirmText="Xóa ngay"
                cancelText="Hủy bỏ"
            />
        </div>
        </FadeIn>
    );
};
