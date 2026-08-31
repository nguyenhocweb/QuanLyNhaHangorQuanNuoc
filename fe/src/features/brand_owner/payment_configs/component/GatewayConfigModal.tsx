import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
    MdClose, 
    MdOutlineAccountBalance, 
    MdQrCode2, 
    MdSecurity, 
    MdPayment,
    MdCheckCircle 
} from 'react-icons/md';
import { PaymentMethodCombined } from '../type/brand_payment.type';
import { useUpsertBrandPaymentConfig } from '../hook/useUpsertBrandPaymentConfig';

interface Props {
    brandId: string;
    item: PaymentMethodCombined | null;
    isOpen: boolean;
    onClose: () => void;
}

const POPULAR_BANKS = [
    { code: '970436', shortName: 'Vietcombank', name: 'Ngân hàng Ngoại thương Việt Nam' },
    { code: '970422', shortName: 'MBBank', name: 'Ngân hàng Quân đội' },
    { code: '970415', shortName: 'VietinBank', name: 'Ngân hàng Công thương Việt Nam' },
    { code: '970418', shortName: 'BIDV', name: 'Ngân hàng Đầu tư và Phát triển VN' },
    { code: '970407', shortName: 'Techcombank', name: 'Ngân hàng Kỹ thương Việt Nam' },
    { code: '970416', shortName: 'ACB', name: 'Ngân hàng Á Châu' },
    { code: '970432', shortName: 'VPBank', name: 'Ngân hàng Việt Nam Thịnh Vượng' },
    { code: '970423', shortName: 'TPBank', name: 'Ngân hàng Tiên Phong' },
    { code: '970403', shortName: 'Sacombank', name: 'Ngân hàng Sài Gòn Thương Tín' },
    { code: '970441', shortName: 'VIB', name: 'Ngân hàng Quốc Tế' },
];

export const GatewayConfigModal: React.FC<Props> = ({
    brandId,
    item,
    isOpen,
    onClose
}) => {
    const { mutate: upsertConfig, isPending } = useUpsertBrandPaymentConfig(brandId);

    const isBankTransfer = item?.method.code === 'BANK_TRANSFER' || item?.method.code === 'VIETQR';
    const isMomo = item?.method.code === 'MOMO';
    const isVnpay = item?.method.code === 'VNPAY';
    const isPayOS = item?.method.code === 'PAYOS' || item?.method.code === 'SEPAY';

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<any>({
        defaultValues: {
            isActive: true,
            isTestMode: false,
            // Bank fields
            bankCode: '970436',
            bankName: 'Vietcombank',
            accountNumber: '',
            accountHolder: '',
            // Momo / VNPAY / PayOS fields
            partnerCode: '',
            apiKey: '',
            secretKey: '',
            checksumKey: '',
            vnp_TmnCode: '',
            vnp_HashSecret: '',
            vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
        }
    });

    useEffect(() => {
        if (item) {
            const configData = item.config?.configData || {};
            reset({
                isActive: item.config?.isActive ?? true,
                isTestMode: item.config?.isTestMode ?? false,
                bankCode: configData.bankCode || '970436',
                bankName: configData.bankName || 'Vietcombank',
                accountNumber: configData.accountNumber || '',
                accountHolder: configData.accountHolder || '',
                partnerCode: configData.partnerCode || '',
                apiKey: configData.apiKey || '',
                secretKey: configData.secretKey || '',
                checksumKey: configData.checksumKey || '',
                vnp_TmnCode: configData.vnp_TmnCode || '',
                vnp_HashSecret: configData.vnp_HashSecret || '',
                vnp_Url: configData.vnp_Url || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
            });
        }
    }, [item, reset]);

    if (!isOpen || !item) return null;

    const onSubmit = (data: any) => {
        let configData: Record<string, any> = {};

        if (isBankTransfer) {
            configData = {
                bankCode: data.bankCode,
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                accountHolder: data.accountHolder?.toUpperCase()
            };
        } else if (isMomo) {
            configData = {
                partnerCode: data.partnerCode,
                apiKey: data.apiKey,
                secretKey: data.secretKey
            };
        } else if (isVnpay) {
            configData = {
                vnp_TmnCode: data.vnp_TmnCode,
                vnp_HashSecret: data.vnp_HashSecret,
                vnp_Url: data.vnp_Url
            };
        } else if (isPayOS) {
            configData = {
                clientId: data.partnerCode,
                apiKey: data.apiKey,
                checksumKey: data.checksumKey
            };
        } else {
            configData = { ...data };
        }

        upsertConfig({
            systemPaymentMethodId: item.method.id,
            payload: {
                isActive: data.isActive,
                isTestMode: data.isTestMode,
                configData
            }
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;
        const found = POPULAR_BANKS.find(b => b.code === selectedCode);
        if (found) {
            setValue('bankCode', found.code);
            setValue('bankName', found.shortName);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                            {isBankTransfer ? <MdQrCode2 /> : <MdPayment />}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">
                                Cấu hình {item.method.name}
                            </h3>
                            <p className="text-xs text-gray-500">Mã phương thức: {item.method.code}</p>
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

                {/* Body Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto flex-1 space-y-4">
                    {/* Status & Test Mode Toggles */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-xs font-semibold text-gray-700">Kích hoạt phương thức</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('isTestMode')}
                                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                            />
                            <span className="text-xs font-semibold text-gray-700">Chế độ Thử nghiệm (Test)</span>
                        </label>
                    </div>

                    {/* Form fields based on Method */}
                    {isBankTransfer && (
                        <div className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Ngân hàng thụ hưởng <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register('bankCode')}
                                    onChange={handleBankChange}
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                >
                                    {POPULAR_BANKS.map(bank => (
                                        <option key={bank.code} value={bank.code}>
                                            {bank.shortName} - {bank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Số tài khoản nhận tiền <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('accountNumber', { required: true })}
                                    placeholder="Ví dụ: 1025588668"
                                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tên chủ tài khoản (Không dấu) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('accountHolder', { required: true })}
                                    placeholder="Ví dụ: CONG TY TNHH PHUC LONG"
                                    className="w-full uppercase text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    )}

                    {isMomo && (
                        <div className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Partner Code (Merchant ID) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('partnerCode')}
                                    placeholder="Mã đối tác MoMo cung cấp"
                                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Access Key / API Key <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('apiKey')}
                                    placeholder="Access Key"
                                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Secret Key <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    {...register('secretKey')}
                                    placeholder="••••••••••••••••"
                                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    )}

                    {isVnpay && (
                        <div className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Terminal ID (vnp_TmnCode) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('vnp_TmnCode')}
                                    placeholder="Ví dụ: VNPAYDEMO"
                                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Hash Secret (vnp_HashSecret) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    {...register('vnp_HashSecret')}
                                    placeholder="••••••••••••••••"
                                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    URL Cổng thanh toán (vnp_Url) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('vnp_Url')}
                                    placeholder="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    )}

                    {isPayOS && (
                        <div className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Client ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('partnerCode')}
                                    placeholder="Client ID do PayOS cung cấp"
                                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    API Key <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    {...register('apiKey')}
                                    placeholder="••••••••••••••••"
                                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Checksum Key <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    {...register('checksumKey')}
                                    placeholder="••••••••••••••••"
                                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Footer Submit */}
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
                            disabled={isPending}
                            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                        >
                            <MdCheckCircle className="text-base" />
                            <span>{isPending ? 'Đang lưu...' : 'Lưu cấu hình'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
