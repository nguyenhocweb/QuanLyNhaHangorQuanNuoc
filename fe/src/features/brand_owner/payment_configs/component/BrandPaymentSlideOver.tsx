import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
    MdClose, 
    MdInfo, 
    MdSettings, 
    MdCheckCircle, 
    MdPayment, 
    MdQrCode2,
    MdSecurity
} from 'react-icons/md';
import { PaymentMethodCombined } from '../type/brand_payment.type';
import { PREDEFINED_BRAND_PAYMENT_METHODS } from '../constants/brand_payment.constant';
import { BrandDynamicApiForm } from './BrandDynamicApiForm';
import { useCreateBrandPaymentMethod } from '../hook/useCreateBrandPaymentMethod';
import { useUpsertBrandPaymentConfig } from '../hook/useUpsertBrandPaymentConfig';

interface Props {
    brandId: string;
    isOpen: boolean;
    onClose: () => void;
    item: PaymentMethodCombined | null;
    allMethods?: PaymentMethodCombined[];
}

export const BrandPaymentSlideOver: React.FC<Props> = ({
    brandId,
    isOpen,
    onClose,
    item,
    allMethods = []
}) => {
    const isCreateMode = !item;
    const [activeTab, setActiveTab] = useState<'general' | 'api'>(isCreateMode ? 'general' : 'api');
    const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);

    const { mutate: createMethod, isPending: isCreating } = useCreateBrandPaymentMethod(brandId);
    const { mutate: upsertConfig, isPending: isUpdatingConfig } = useUpsertBrandPaymentConfig(brandId);

    // Form 1: General Info
    const generalForm = useForm<any>({
        defaultValues: {
            name: '',
            code: '',
            description: '',
            iconUrl: '',
            isActive: true
        }
    });

    // Form 2: API & Account Config
    const configForm = useForm<any>({
        defaultValues: {
            isActive: true,
            isTestMode: false,
            configData: {}
        }
    });

    // Pre-fill General Form
    useEffect(() => {
        if (item) {
            generalForm.reset({
                name: item.method.name,
                code: item.method.code,
                description: item.method.description || '',
                iconUrl: item.method.iconUrl || '',
                isActive: item.method.isActive
            });
            setActiveTab('api');
        } else {
            generalForm.reset({
                name: '',
                code: '',
                description: '',
                iconUrl: '',
                isActive: true
            });
            setActiveTab('general');
        }
    }, [item, generalForm]);

    // Pre-fill API Config Form
    useEffect(() => {
        if (item) {
            const configData = item.config?.configData || {};
            configForm.reset({
                isActive: item.config?.isActive ?? true,
                isTestMode: item.config?.isTestMode ?? false,
                configData: {
                    bankCode: configData.bankCode || '970436',
                    bankName: configData.bankName || 'Vietcombank',
                    accountNumber: configData.accountNumber || '',
                    accountHolder: configData.accountHolder || '',
                    partnerCode: configData.partnerCode || '',
                    accessKey: configData.accessKey || '',
                    secretKey: configData.secretKey || '',
                    vnp_TmnCode: configData.vnp_TmnCode || '',
                    vnp_HashSecret: configData.vnp_HashSecret || '',
                    vnp_Url: configData.vnp_Url || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
                    clientId: configData.clientId || '',
                    apiKey: configData.apiKey || '',
                    checksumKey: configData.checksumKey || '',
                    apiToken: configData.apiToken || '',
                    ...configData
                }
            });
        }
    }, [item, configForm]);

    if (!isOpen) return null;

    const onGeneralSubmit = (data: any) => {
        if (isCreateMode) {
            createMethod({
                name: data.name,
                code: data.code.trim().toUpperCase(),
                description: data.description,
                iconUrl: data.iconUrl,
                isActive: data.isActive
            }, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    const onConfigSubmit = (data: any) => {
        if (!item) return;

        upsertConfig({
            systemPaymentMethodId: item.method.id,
            payload: {
                isActive: data.isActive,
                isTestMode: data.isTestMode,
                configData: data.configData
            }
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const handleSelectPreset = (preset: typeof PREDEFINED_BRAND_PAYMENT_METHODS[0]) => {
        generalForm.setValue('name', preset.name);
        generalForm.setValue('code', preset.code);
        generalForm.setValue('description', preset.description);
        generalForm.setValue('iconUrl', preset.iconUrl);
        setIsPresetDropdownOpen(false);
    };

    const currentProviderCode = item?.method.code || generalForm.watch('code') || 'VIETQR';

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                            <MdPayment />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">
                                {isCreateMode ? 'Thêm phương thức thanh toán mới' : `Cấu hình ${item.method.name}`}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {isCreateMode ? 'Tạo mới cổng thanh toán cho thương hiệu' : `Mã phương thức: ${item.method.code}`}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                    >
                        <MdClose className="text-lg" />
                    </button>
                </div>

                {/* Navigation Tabs */}
                {!isCreateMode && (
                    <div className="flex border-b border-gray-100 bg-gray-50/70 px-5 gap-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab('api')}
                            className={`py-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
                                activeTab === 'api'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <MdSettings className="text-base" /> Cấu hình Tài khoản & API
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('general')}
                            className={`py-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
                                activeTab === 'general'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <MdInfo className="text-base" /> Thông tin phương thức
                        </button>
                    </div>
                )}

                {/* Content Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {activeTab === 'general' ? (
                        <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-4">
                            {/* Preset Selector */}
                            {isCreateMode && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Chọn mẫu cổng thanh toán phổ biến:
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {PREDEFINED_BRAND_PAYMENT_METHODS.map(preset => (
                                            <button
                                                key={preset.code}
                                                type="button"
                                                onClick={() => handleSelectPreset(preset)}
                                                className="p-2.5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all flex items-center gap-2"
                                            >
                                                {preset.iconUrl ? (
                                                    <img src={preset.iconUrl} alt={preset.name} className="w-5 h-5 object-contain" />
                                                ) : (
                                                    <MdPayment className="text-indigo-600 text-base" />
                                                )}
                                                <span className="text-xs font-semibold text-gray-800 truncate">{preset.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tên hiển thị phương thức <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...generalForm.register('name', { required: 'Vui lòng nhập tên phương thức' })}
                                    placeholder="Ví dụ: VietQR / Chuyển khoản"
                                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Mã code hệ thống <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    disabled={!isCreateMode}
                                    {...generalForm.register('code', { required: 'Vui lòng nhập mã code' })}
                                    placeholder="Ví dụ: VIETQR, MOMO, VNPAY"
                                    className="w-full uppercase font-mono text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Mô tả phương thức
                                </label>
                                <textarea
                                    {...generalForm.register('description')}
                                    rows={3}
                                    placeholder="Mô tả ngắn gọn..."
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Link Logo / Icon
                                </label>
                                <input
                                    type="text"
                                    {...generalForm.register('iconUrl')}
                                    placeholder="https://..."
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {isCreateMode && (
                                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                                    >
                                        <MdCheckCircle className="text-base" />
                                        <span>{isCreating ? 'Đang tạo...' : 'Tạo phương thức'}</span>
                                    </button>
                                </div>
                            )}
                        </form>
                    ) : (
                        <form onSubmit={configForm.handleSubmit(onConfigSubmit)} className="space-y-5">
                            {/* Status & Test Mode Toggles */}
                            <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...configForm.register('isActive')}
                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-xs font-semibold text-gray-700">Kích hoạt cổng</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...configForm.register('isTestMode')}
                                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                                    />
                                    <span className="text-xs font-semibold text-gray-700">Thử nghiệm (Test)</span>
                                </label>
                            </div>

                            {/* Dynamic API Form */}
                            <BrandDynamicApiForm form={configForm} providerCode={currentProviderCode} />

                            {/* Submit Button */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdatingConfig}
                                    className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                                >
                                    <MdCheckCircle className="text-base" />
                                    <span>{isUpdatingConfig ? 'Đang lưu...' : 'Lưu cấu hình API'}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
