"use client";
import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { useGetSubscriptions, useDeleteSubscription, useUpdateSubscription } from '../hook/useSubscription_hook';
import { CreateSubscriptionForm } from './CreateSubscriptionForm';
import { UpdateSubscriptionForm } from './UpdateSubscriptionForm';
import { SubscriptionPlan } from '../type/subscription.type';
import { H, P } from '@/src/core/components/ui';
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal';

export const SubscriptionsList = () => {
    const { data: responseData, isLoading } = useGetSubscriptions();
    const data: SubscriptionPlan[] = responseData?.data || [];
    
    const { mutate: deleteSub } = useDeleteSubscription();
    const { mutate: updateSub } = useUpdateSubscription();

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        confirmText: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Xóa',
        onConfirm: () => {}
    });

    const openConfirmModal = (title: string, message: string, onConfirm: () => void, confirmText = 'Xóa') => {
        setConfirmModal({ isOpen: true, title, message, confirmText, onConfirm });
    };

    const closeConfirmModal = () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    const deleteSubscription = (id: string) => {
        openConfirmModal(
            'Xóa gói cước',
            'Bạn có chắc chắn muốn xóa gói cước này? Hành động này không thể hoàn tác.',
            () => {
                deleteSub(id);
                closeConfirmModal();
            }
        );
    };

    const toggleStatus = (plan: SubscriptionPlan) => {
        updateSub({ 
            id: plan.id, 
            name: plan.name,
            price: plan.price,
            billingCycle: plan.billingCycle,
            maxRestaurants: plan.maxRestaurants,
            featuresData: plan.featuresData,
            isActive: !plan.isActive 
        } as any);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
    const [viewingDiscountPlan, setViewingDiscountPlan] = useState<SubscriptionPlan | null>(null);

    const filteredData = data.filter(plan => 
        plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getBillingCycleText = (cycle: string) => {
        switch(cycle) {
            case 'MONTHLY': return 'Tháng';
            case 'YEARLY': return 'Năm';
            case 'LIFETIME': return 'Trọn đời';
            default: return cycle;
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 p-6">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                <div>
                    <H variant="text_black" className="text-2xl font-bold text-gray-900">Quản lý Gói cước</H>
                    <P className="text-gray-500 mt-1">Quản lý các gói dịch vụ và giới hạn tính năng cho thương hiệu</P>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-medium rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                    <FiPlus className="text-lg" />
                    Thêm gói cước mới
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <FiSearch className="absolute left-3.5 top-3 text-gray-400 text-lg" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm gói cước..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-[14px] transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider">Tên Gói</th>
                                <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider">Giá tiền</th>
                                <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider">Giới hạn</th>
                                <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Đang tải dữ liệu...</td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Không tìm thấy gói cước nào.</td>
                                </tr>
                            ) : (
                                filteredData.map((plan) => (
                                    <tr key={plan.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{plan.name}</div>
                                            <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{plan.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {plan.discountPrice !== undefined && plan.discountPrice !== null ? (
                                                <>
                                                    <div className="font-bold text-red-600">{formatPrice(plan.discountPrice)}</div>
                                                    <div className="text-[12px] text-gray-400 line-through">{formatPrice(plan.price)}</div>
                                                    {plan.discountEndDate && (
                                                        <div className="text-[10px] text-red-500 font-medium mt-0.5 bg-red-50 px-1.5 py-0.5 rounded inline-block">
                                                            Tới {new Date(plan.discountEndDate).toLocaleDateString('vi-VN')}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="font-bold text-indigo-600">{formatPrice(plan.price)}</div>
                                            )}
                                            <div className="text-[12px] text-gray-500 mt-0.5">/ {getBillingCycleText(plan.billingCycle)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700">
                                                {plan.maxRestaurants === -1 ? 'Không giới hạn' : `${plan.maxRestaurants} nhà hàng`}
                                            </div>
                                            <div className="text-[12px] text-gray-500 mt-1">{Object.keys(plan.featuresData || {}).length} tính năng</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => toggleStatus(plan)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${plan.isActive ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                            >
                                                {plan.isActive ? <FiCheck /> : <FiX />}
                                                {plan.isActive ? 'Đang bán' : 'Dừng bán'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {plan.discountPrice !== undefined && plan.discountPrice !== null && (
                                                    <button 
                                                        onClick={() => setViewingDiscountPlan(plan)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Chi tiết khuyến mãi"
                                                    >
                                                        <FiInfo className="text-lg" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => setEditingPlan(plan)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <FiEdit2 className="text-lg" />
                                                </button>
                                                <button 
                                                    onClick={() => deleteSubscription(plan.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <FiTrash2 className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {isCreateModalOpen && (
                <CreateSubscriptionForm onClose={() => setIsCreateModalOpen(false)} />
            )}
            
            {editingPlan && (
                <UpdateSubscriptionForm 
                    initialData={editingPlan} 
                    onClose={() => setEditingPlan(null)} 
                />
            )}

            {viewingDiscountPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 overflow-y-auto p-4">
                    <div className="bg-white flex flex-col relative p-6 rounded-2xl shadow-2xl w-full max-w-[400px] border border-gray-100 my-auto">
                        <button onClick={() => setViewingDiscountPlan(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all" type="button">
                            <FiX className="text-xl" />
                        </button>
                        
                        <div className="mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-gray-900">Chi tiết Khuyến mãi</h2>
                            <p className="text-indigo-600 font-semibold text-sm mt-1">{viewingDiscountPlan.name}</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-sm font-medium text-gray-500">Giá gốc</span>
                                <span className="text-sm font-semibold text-gray-400 line-through">{formatPrice(viewingDiscountPlan.price)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-sm font-medium text-gray-500">Giá ưu đãi</span>
                                <span className="text-lg font-bold text-red-600">{formatPrice(viewingDiscountPlan.discountPrice!)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-sm font-medium text-gray-500">Tiết kiệm được</span>
                                <span className="text-sm font-bold text-green-600">{formatPrice(viewingDiscountPlan.price - viewingDiscountPlan.discountPrice!)}</span>
                            </div>
                            {viewingDiscountPlan.discountStartDate && (
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-sm font-medium text-gray-500">Ngày bắt đầu</span>
                                    <span className="text-sm font-semibold text-gray-800">{new Date(viewingDiscountPlan.discountStartDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                            )}
                            {viewingDiscountPlan.discountEndDate && (
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-sm font-medium text-gray-500">Ngày kết thúc</span>
                                    <span className="text-sm font-semibold text-red-500">{new Date(viewingDiscountPlan.discountEndDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-8 flex justify-end gap-2">
                            <button onClick={() => {
                                setEditingPlan(viewingDiscountPlan);
                                setViewingDiscountPlan(null);
                            }} className="flex-1 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[13px] font-medium rounded-xl transition-colors text-center">
                                Chỉnh sửa
                            </button>
                            <button onClick={() => {
                                openConfirmModal(
                                    'Xóa khuyến mãi',
                                    'Bạn có chắc chắn muốn gỡ bỏ khuyến mãi của gói cước này? Giá gói cước sẽ trở về mức giá gốc ban đầu.',
                                    () => {
                                        updateSub({
                                            id: viewingDiscountPlan.id,
                                            discountPrice: null,
                                            discountStartDate: null,
                                            discountEndDate: null
                                        } as any, {
                                            onSuccess: () => {
                                                setViewingDiscountPlan(null);
                                                closeConfirmModal();
                                            }
                                        });
                                    },
                                    'Xóa khuyến mãi'
                                );
                            }} className="flex-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-[13px] font-medium rounded-xl transition-colors text-center">
                                Xóa
                            </button>
                            <button onClick={() => setViewingDiscountPlan(null)} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-medium rounded-xl transition-colors text-center">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Confirm Modal */}
            <ConfirmModal
                open={confirmModal.isOpen}
                title={confirmModal.title}
                content={confirmModal.message}
                type="danger"
                confirmText={confirmModal.confirmText}
                onClose={closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
            />
        </div>
    );
};
