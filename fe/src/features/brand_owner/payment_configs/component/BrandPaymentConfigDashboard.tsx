import React, { useState } from 'react';
import { 
    MdPayment, 
    MdQrCode2, 
    MdOutlineAccountBalance, 
    MdCheckCircle, 
    MdSettings, 
    MdOutlineSmartphone,
    MdRefresh,
    MdAdd
} from 'react-icons/md';
import { FiCheckCircle, FiXCircle, FiSettings, FiPlus } from 'react-icons/fi';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { PaymentMethodCombined } from '../type/brand_payment.type';
import { useBrandPaymentConfigs } from '../hook/useBrandPaymentConfigs';
import { BrandPaymentSlideOver } from './BrandPaymentSlideOver';

interface Props {
    brandId: string;
}

export const BrandPaymentConfigDashboard: React.FC<Props> = ({ brandId }) => {
    const { data, isLoading, refetch, isRefetching } = useBrandPaymentConfigs(brandId);
    const [selectedItem, setSelectedItem] = useState<PaymentMethodCombined | null>(null);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

    const paymentMethods = data?.metadata?.paymentMethods || [];

    const handleOpenCreate = () => {
        setSelectedItem(null);
        setIsSlideOverOpen(true);
    };

    const handleOpenEdit = (item: PaymentMethodCombined) => {
        setSelectedItem(item);
        setIsSlideOverOpen(true);
    };

    return (
        <FadeIn className="w-full space-y-6 pb-12">
            {/* Header Block */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                        <MdPayment className="text-indigo-600 text-2xl" /> Quản lý Cổng thanh toán & Ngân hàng
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Quản lý và cấu hình tài khoản VietQR, ví điện tử và cổng thanh toán dành riêng cho thương hiệu của bạn
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        className="py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                    >
                        <FiPlus className="text-base" />
                        <span>Thêm phương thức</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="py-2.5 px-4 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                        <MdRefresh className={`text-base ${isRefetching ? 'animate-spin' : ''}`} />
                        <span>Làm mới</span>
                    </button>
                </div>
            </div>

            {/* List / Grid of Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-16 text-center text-gray-400">
                        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm">Đang tải danh sách phương thức thanh toán...</p>
                    </div>
                ) : paymentMethods.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 p-8 space-y-3">
                        <MdPayment className="text-4xl text-gray-300 mx-auto" />
                        <p className="text-sm font-semibold">Chưa có phương thức thanh toán nào.</p>
                        <button
                            type="button"
                            onClick={handleOpenCreate}
                            className="py-2 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all inline-flex items-center gap-1.5"
                        >
                            <FiPlus /> Thêm phương thức ngay
                        </button>
                    </div>
                ) : (
                    paymentMethods.map((item) => {
                        const isConfigured = Boolean(item.config && Object.keys(item.config.configData || {}).length > 0);
                        const isConfigActive = item.config?.isActive ?? item.method.isActive;
                        const isTestMode = item.config?.isTestMode ?? false;

                        return (
                            <div
                                key={item.method.id}
                                onClick={() => handleOpenEdit(item)}
                                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
                            >
                                <div>
                                    {/* Card Top: Logo & Status Badge */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-center p-3 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                                            {item.method.iconUrl ? (
                                                <img src={item.method.iconUrl} alt={item.method.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <MdPayment className="text-3xl text-indigo-600" />
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${
                                                isConfigActive 
                                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                                    : 'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>
                                                {isConfigActive ? <><FiCheckCircle className="text-green-600" /> Đang bật</> : <><FiXCircle /> Đã tắt</>}
                                            </span>

                                            {isTestMode && (
                                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.2 rounded">
                                                    Test Mode
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Title & Code Tag */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {item.method.name}
                                        </h3>
                                        <div className="text-xs font-mono font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded inline-block mt-1.5 mb-2">
                                            {item.method.code}
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                            {item.method.description || 'Chưa có mô tả chi tiết...'}
                                        </p>
                                    </div>

                                    {/* Config Preview Details */}
                                    {isConfigured && item.config?.configData && (
                                        <div className="mt-3 bg-gray-50/80 rounded-xl p-3 text-xs space-y-1 text-gray-600 border border-gray-100">
                                            {item.config.configData.bankName && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Ngân hàng:</span>
                                                    <span className="font-semibold text-gray-800">{item.config.configData.bankName}</span>
                                                </div>
                                            )}
                                            {item.config.configData.accountNumber && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Số tài khoản:</span>
                                                    <span className="font-mono font-bold text-indigo-700">{item.config.configData.accountNumber}</span>
                                                </div>
                                            )}
                                            {item.config.configData.partnerCode && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Merchant ID:</span>
                                                    <span className="font-mono text-gray-700">{item.config.configData.partnerCode}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer Action */}
                                <div className="mt-5 pt-3.5 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xs text-indigo-600 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                                        <FiSettings /> {isConfigured ? 'Nhấn để chỉnh sửa' : 'Nhấn để cấu hình'}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Slide-over Drawer */}
            <BrandPaymentSlideOver
                brandId={brandId}
                isOpen={isSlideOverOpen}
                onClose={() => {
                    setIsSlideOverOpen(false);
                    setSelectedItem(null);
                }}
                item={selectedItem}
                allMethods={paymentMethods}
            />
        </FadeIn>
    );
};
