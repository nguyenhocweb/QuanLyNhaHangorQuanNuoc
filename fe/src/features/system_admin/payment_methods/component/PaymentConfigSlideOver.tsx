import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiX, FiInfo, FiSettings, FiSave, FiAlertCircle } from 'react-icons/fi';
import { SystemPaymentMethod, PaymentProviderCode } from '../type/payment.type';
import { 
    methodMetadataSchema, 
    MethodMetadataFormValues, 
    apiConfigSchema,
    ApiConfigFormValues
} from '../schema/payment.schema';
import { useCreatePaymentMethod, useUpdatePaymentMethod, usePaymentConfig, useUpsertPaymentConfig } from '../hook/usePayment';
import { DynamicApiForm } from './DynamicApiForm';
import { PREDEFINED_METHODS } from '../constants/payment.constant';
import { PaymentVerificationModal } from './PaymentVerificationModal';

interface PaymentConfigSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    method: SystemPaymentMethod | null;
    allMethods?: SystemPaymentMethod[];
}

export const PaymentConfigSlideOver: React.FC<PaymentConfigSlideOverProps> = ({ isOpen, onClose, method, allMethods = [] }) => {
    const isCreateMode = !method;
    const [activeTab, setActiveTab] = useState<'general' | 'api'>('general');
    const [isCodeDropdownOpen, setIsCodeDropdownOpen] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    
    // API Config Fetching (only if editing)
    const { data: configData, isLoading: isLoadingConfig } = usePaymentConfig(method?.id);
    
    // Mutations
    const { mutate: createMetadata, isPending: isCreatingMetadata } = useCreatePaymentMethod();
    const { mutate: updateMetadata, isPending: isUpdatingMetadata } = useUpdatePaymentMethod();
    const { mutate: upsertConfig, isPending: isUpdatingConfig } = useUpsertPaymentConfig(method?.id || '');

    // Form 1: General Info
    const generalForm = useForm<MethodMetadataFormValues>({
        resolver: zodResolver(methodMetadataSchema) as any,
    });

    const selectedCode = generalForm.watch('code');
    const selectedMethodData = PREDEFINED_METHODS.find(m => m.code === selectedCode);
    
    const existingCodes = allMethods.map(m => m.code);
    const availableMethods = PREDEFINED_METHODS.filter(m => !existingCodes.includes(m.code));

    // Form 2: API Config
    const configForm = useForm<ApiConfigFormValues>({
        resolver: zodResolver(apiConfigSchema) as any,
    });

    // Pre-fill General Form
    useEffect(() => {
        if (method) {
            generalForm.reset({
                name: method.name,
                code: method.code,
                description: method.description,
                iconUrl: method.iconUrl,
                isActive: method.isActive,
            });
        } else {
            generalForm.reset({
                name: '',
                code: '',
                description: '',
                iconUrl: '',
                isActive: true,
            });
        }
    }, [method, generalForm]);

    // Pre-fill API Config Form
    useEffect(() => {
        if (method && configData) {
            configForm.reset({
                providerCode: method.code as any,
                configData: configData.configData || {},
                isActive: configData.isActive,
                isTestMode: configData.isTestMode,
            });
        } else if (method) {
            configForm.reset({
                providerCode: method.code as any,
                configData: {},
                isActive: true,
                isTestMode: true,
            });
        }
    }, [method, configData, configForm]);

    const onGeneralSubmit = (data: MethodMetadataFormValues) => {
        if (isCreateMode) {
            createMetadata(data, {
                onSuccess: () => {
                    onClose();
                }
            });
        } else if (method) {
            updateMetadata({ id: method.id, data });
        }
    };

    const onConfigSubmit = (data: ApiConfigFormValues) => {
        if (!method) return;
        upsertConfig(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 p-1 flex items-center justify-center shadow-sm">
                            {method?.iconUrl ? (
                                <img src={method.iconUrl} alt={method?.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-gray-400 font-bold text-xl">+</span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{isCreateMode ? "Thêm phương thức mới" : method?.name}</h2>
                            <p className="text-xs text-gray-500 font-mono">{isCreateMode ? "Cấu hình chung" : method?.code}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="flex px-6 border-b border-gray-100 gap-6">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <FiInfo /> Thông tin chung
                    </button>
                    <button
                        onClick={() => setActiveTab('api')}
                        disabled={isCreateMode}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === 'api' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <FiSettings /> Cấu hình API
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <form id="general-form" onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-5 animate-in fade-in duration-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị <span className="text-red-500">*</span></label>
                                <input 
                                    {...generalForm.register("name")} 
                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-indigo-500 outline-none"
                                />
                                {generalForm.formState.errors.name && <p className="text-red-500 text-xs mt-1">{generalForm.formState.errors.name.message}</p>}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã hệ thống (Code) <span className="text-red-500">*</span></label>
                                {isCreateMode ? (
                                    <>
                                        <div 
                                            onClick={() => setIsCodeDropdownOpen(!isCodeDropdownOpen)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:ring-indigo-500 outline-none flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-colors"
                                        >
                                            {selectedMethodData ? (
                                                <div className="flex items-center gap-3">
                                                    <img src={selectedMethodData.iconUrl} alt={selectedMethodData.code} className="w-5 h-5 object-contain" />
                                                    <span className="font-medium text-gray-900 uppercase">{selectedMethodData.code}</span>
                                                    <span className="text-gray-500 text-sm">({selectedMethodData.name})</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-- Chọn mã phương thức --</span>
                                            )}
                                            <span className="text-gray-400 text-xs">▼</span>
                                        </div>
                                        
                                        {isCodeDropdownOpen && (
                                            <>
                                                {/* Backdrop to close when clicking outside */}
                                                <div className="fixed inset-0 z-40" onClick={() => setIsCodeDropdownOpen(false)} />
                                                
                                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-auto py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {availableMethods.length > 0 ? (
                                                        availableMethods.map(m => (
                                                            <div 
                                                                key={m.code}
                                                                onClick={() => {
                                                                    generalForm.setValue("code", m.code, { shouldValidate: true });
                                                                    const currentName = generalForm.getValues("name");
                                                                    const currentIcon = generalForm.getValues("iconUrl");
                                                                    if (!currentName) generalForm.setValue("name", m.name, { shouldValidate: true });
                                                                    if (!currentIcon) generalForm.setValue("iconUrl", m.iconUrl, { shouldValidate: true });
                                                                    setIsCodeDropdownOpen(false);
                                                                }}
                                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 cursor-pointer transition-colors"
                                                            >
                                                                <img src={m.iconUrl} alt={m.code} className="w-8 h-8 object-contain rounded bg-white border border-gray-100 p-1 shadow-sm" />
                                                                <div>
                                                                    <div className="font-bold text-gray-900 uppercase text-sm">{m.code}</div>
                                                                    <div className="text-xs text-gray-500">{m.name}</div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-4 text-center text-sm text-gray-500">
                                                            Tất cả phương thức đã được cấu hình.
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 flex items-center gap-3">
                                        {selectedMethodData ? (
                                            <>
                                                <img src={selectedMethodData.iconUrl} alt={selectedMethodData.code} className="w-5 h-5 object-contain grayscale opacity-60" />
                                                <span className="uppercase font-medium">{generalForm.getValues("code")}</span>
                                            </>
                                        ) : (
                                            <span className="uppercase font-medium">{generalForm.getValues("code")}</span>
                                        )}
                                    </div>
                                )}
                                {generalForm.formState.errors.code && <p className="text-red-500 text-xs mt-1">{generalForm.formState.errors.code.message}</p>}
                            </div>

                            {/* Icon URL is auto-filled by Code selection, so we keep it hidden */}
                            <input type="hidden" {...generalForm.register("iconUrl")} />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn gọn</label>
                                <textarea 
                                    {...generalForm.register("description")} 
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-indigo-500 outline-none resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" {...generalForm.register("isActive")} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                                <div>
                                    <span className="text-sm font-medium text-gray-900 block">Kích hoạt phương thức</span>
                                    <span className="text-xs text-gray-500">Cho phép người dùng nhìn thấy cổng thanh toán này</span>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* API Config Tab */}
                    {activeTab === 'api' && (
                        <form id="api-form" onSubmit={configForm.handleSubmit(onConfigSubmit)} className="space-y-6 animate-in fade-in duration-200">
                            {isLoadingConfig ? (
                                <div className="text-center py-10 text-gray-500 text-sm animate-pulse">Đang tải cấu hình...</div>
                            ) : (
                                <>
                                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                        <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                                            <FiSettings /> Thông số kết nối API
                                        </h4>
                                        <DynamicApiForm form={configForm} providerCode={method?.code || ''} />
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        
                                        {/* Status & Verification Gate */}
                                        <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900 block">Trạng thái kiểm định</span>
                                                    <span className="text-xs text-gray-500">Bắt buộc phải kiểm định bằng luồng Test trước khi kích hoạt</span>
                                                </div>
                                                
                                                {configData?.verificationStatus === 'VERIFIED' ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                                                        <FiCheckCircle /> Đã kiểm định
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200 flex items-center gap-1">
                                                        <FiAlertCircle /> Chưa kiểm định
                                                    </span>
                                                )}
                                            </div>

                                            {configData?.verificationStatus !== 'VERIFIED' ? (
                                                <div className="w-full">
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setIsVerificationModalOpen(true);
                                                        }}
                                                        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                                                    >
                                                        Tạo mã Test 1.000đ để Kiểm định
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-900 block">Trạng thái Áp dụng (Active)</span>
                                                        <span className="text-xs text-gray-500">Cho phép hệ thống sử dụng cổng này</span>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" {...configForm.register("isActive")} className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between px-2">
                                            <div>
                                                <span className="text-sm font-medium text-gray-900 block">Môi trường thử nghiệm (Test Mode)</span>
                                                <span className="text-xs text-gray-500">Sử dụng URL Sandbox của cổng thanh toán</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" {...configForm.register("isTestMode")} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
                    >
                        Đóng
                    </button>
                    <button
                        type="submit"
                        form={activeTab === 'general' ? 'general-form' : 'api-form'}
                        disabled={isUpdatingMetadata || isUpdatingConfig || isCreatingMetadata}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isUpdatingMetadata || isUpdatingConfig || isCreatingMetadata ? "Đang xử lý..." : <><FiSave /> Lưu thay đổi</>}
                    </button>
                </div>
            </div>

            {/* Verification Modal */}
            {method && (
                <PaymentVerificationModal 
                    isOpen={isVerificationModalOpen}
                    onClose={() => setIsVerificationModalOpen(false)}
                    systemPaymentMethodId={method.id}
                    providerCode={method.code}
                />
            )}
        </div>
    );
};
