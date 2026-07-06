"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentMethodSchema, PaymentMethodFormValues } from "../schema/payment_method.schema";
import { PaymentMethod } from "../type/payment_method.type";
import { FiX, FiCheck } from "react-icons/fi";
import { PREDEFINED_METHODS, POPULAR_BANKS } from "../constants/payment_method.constant";

interface PaymentMethodFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: PaymentMethod | null;
    onSubmit: (data: PaymentMethodFormValues) => void;
    isPending: boolean;
}

export const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ isOpen, onClose, initialData, onSubmit, isPending }) => {
    const { register, handleSubmit, reset, setValue, clearErrors, watch, formState: { errors } } = useForm<PaymentMethodFormValues>({
        resolver: zodResolver(paymentMethodSchema) as any,
        defaultValues: {
            name: "",
            code: "",
            description: "",
            iconUrl: "",
            isActive: true,
            systemConfig: {},
        }
    });

    const watchCode = watch("code");
    const watchBankName = watch("systemConfig.bankName");

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name,
                    code: initialData.code,
                    description: initialData.description || "",
                    iconUrl: initialData.iconUrl || "",
                    isActive: initialData.isActive,
                    systemConfig: initialData.systemConfig || {},
                });
            } else {
                reset({
                    name: PREDEFINED_METHODS[0].name,
                    code: PREDEFINED_METHODS[0].code,
                    description: "",
                    iconUrl: PREDEFINED_METHODS[0].iconUrl,
                    isActive: true,
                    systemConfig: {},
                });
            }
        }
    }, [isOpen, initialData, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                    <h3 className="text-xl font-bold text-gray-900">
                        {initialData ? "Cập nhật phương thức" : "Thêm phương thức mới"}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
                    <div className="p-6 space-y-5 overflow-y-auto">
                        
                        {/* Predefined Templates */}
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại phương thức thanh toán <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {PREDEFINED_METHODS.map((method) => (
                                    <button
                                        key={method.code}
                                        type="button"
                                        disabled={!!initialData}
                                        onClick={() => {
                                            setValue("name", method.name, { shouldValidate: true });
                                            setValue("code", method.code, { shouldValidate: true });
                                            setValue("iconUrl", method.iconUrl, { shouldValidate: true });
                                            clearErrors(["name", "code", "iconUrl"]);
                                        }}
                                        className={`flex flex-col items-center justify-start gap-1 w-24 p-2 rounded-xl border transition-colors shrink-0 group ${
                                            watchCode === method.code 
                                                ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                                                : initialData 
                                                    ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center p-1.5 shadow-sm group-hover:shadow transition-shadow">
                                            <img src={method.iconUrl} alt={method.name} className={`w-full h-full object-contain ${watchCode === method.code ? '' : initialData ? 'grayscale opacity-50' : ''}`} />
                                        </div>
                                        <span className={`text-[10px] font-medium text-center leading-tight ${watchCode === method.code ? 'text-indigo-700' : 'text-gray-600'}`}>
                                            {method.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            {errors.code && <p className="text-red-500 text-xs mt-1">Vui lòng chọn một phương thức thanh toán</p>}
                        </div>

                        <input type="hidden" {...register("name")} />
                        <input type="hidden" {...register("code")} />
                        <input type="hidden" {...register("iconUrl")} />



                    {/* Dynamic Config Area */}
                    {(watchCode === 'BANK_TRANSFER' || watchCode === 'MOMO' || watchCode === 'ZALOPAY' || watchCode === 'VNPAY') && (
                        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-4">
                            <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                                ⚙️ Cấu hình {watchCode === 'VNPAY' ? 'API VNPay' : 'Tài khoản nhận tiền'}
                            </h4>
                            
                            {watchCode === 'BANK_TRANSFER' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-2">Chọn Ngân hàng <span className="text-red-500">*</span></label>
                                        <div className="max-h-[190px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                                {POPULAR_BANKS.map((bank) => (
                                                    <button
                                                        key={bank.name}
                                                        type="button"
                                                        onClick={() => setValue("systemConfig.bankName", bank.name)}
                                                        className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                                                            watchBankName === bank.name 
                                                                ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                                                                : 'border-gray-200 hover:border-indigo-300 bg-white hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <div className="w-10 h-6 flex items-center justify-center">
                                                            <img src={bank.logoUrl} alt={bank.name} className="max-w-full max-h-full object-contain" />
                                                        </div>
                                                        <span className="text-[9px] font-medium text-gray-600 truncate w-full text-center">{bank.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <input type="hidden" {...register("systemConfig.bankName")} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Số Tài Khoản</label>
                                        <input {...register("systemConfig.accountNumber")} placeholder="Nhập số tài khoản..." className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Tên Chủ Tài Khoản</label>
                                        <input {...register("systemConfig.accountName")} placeholder="NGUYEN VAN A" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 outline-none uppercase text-sm" />
                                    </div>
                                </>
                            )}

                            {(watchCode === 'MOMO' || watchCode === 'ZALOPAY') && (
                                <>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Số điện thoại nhận tiền</label>
                                        <input {...register("systemConfig.phoneNumber")} placeholder="0987..." className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Tên Chủ Tài Khoản</label>
                                        <input {...register("systemConfig.accountName")} placeholder="NGUYEN VAN A" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 outline-none uppercase text-sm" />
                                    </div>
                                </>
                            )}

                            {watchCode === 'VNPAY' && (
                                <>
                                    <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg">
                                        💡 <strong>Mẹo:</strong> VNPay là cổng thanh toán tự động. Bạn cần điền API Key được cung cấp từ hợp đồng VNPay.
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Mã Terminal (vnp_TmnCode)</label>
                                        <input {...register("systemConfig.vnp_TmnCode")} placeholder="Ví dụ: VNPAY123" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 outline-none text-sm uppercase" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Mã Bảo Mật (vnp_HashSecret)</label>
                                        <input {...register("systemConfig.vnp_HashSecret")} type="password" placeholder="Nhập chuỗi mã bảo mật..." className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 outline-none text-sm" />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-3 py-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" {...register("isActive")} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                        <span className="text-sm font-medium text-gray-900">Cho phép hoạt động</span>
                    </div>
                    </div>

                    <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            disabled={isPending}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isPending ? (
                                "Đang xử lý..."
                            ) : (
                                <>
                                    <FiCheck /> {initialData ? "Lưu thay đổi" : "Thêm mới"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
