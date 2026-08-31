import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { POPULAR_BANKS } from '../constants/brand_payment.constant';

interface Props {
    form: UseFormReturn<any>;
    providerCode: string;
}

export const BrandDynamicApiForm: React.FC<Props> = ({ form, providerCode }) => {
    const code = providerCode.toUpperCase();
    const { register, setValue, formState: { errors } } = form;

    const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;
        const found = POPULAR_BANKS.find(b => b.code === selectedCode);
        if (found) {
            setValue('configData.bankCode', found.code);
            setValue('configData.bankName', found.shortName);
        }
    };

    if (code === 'VIETQR' || code === 'BANK_TRANSFER') {
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Ngân hàng thụ hưởng <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register('configData.bankCode')}
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
                        {...register('configData.accountNumber', { required: 'Vui lòng nhập số tài khoản' })}
                        placeholder="Ví dụ: 1025588668"
                        className="w-full text-xs font-mono font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                    {(errors?.configData as any)?.accountNumber && (
                        <p className="text-red-500 text-[11px] mt-1">{(errors?.configData as any).accountNumber.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Tên chủ tài khoản (Viết in hoa, không dấu) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('configData.accountHolder', { required: 'Vui lòng nhập tên chủ tài khoản' })}
                        placeholder="Ví dụ: CONG TY TNHH PHUC LONG"
                        className="w-full uppercase text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                    {(errors?.configData as any)?.accountHolder && (
                        <p className="text-red-500 text-[11px] mt-1">{(errors?.configData as any).accountHolder.message}</p>
                    )}
                </div>
            </div>
        );
    }

    if (code === 'VNPAY') {
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Mã Terminal (vnp_TmnCode) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('configData.vnp_TmnCode', { required: 'Vui lòng nhập vnp_TmnCode' })}
                        placeholder="Ví dụ: VNPAYDEMO"
                        className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Mã Bảo Mật Hash Secret (vnp_HashSecret) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        {...register('configData.vnp_HashSecret', { required: 'Vui lòng nhập Hash Secret' })}
                        placeholder="••••••••••••••••"
                        className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Payment URL (vnp_Url) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('configData.vnp_Url', { required: 'Vui lòng nhập URL cổng' })}
                        placeholder="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
        );
    }

    if (code === 'MOMO') {
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Partner Code (Merchant ID) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('configData.partnerCode', { required: 'Vui lòng nhập Partner Code' })}
                        placeholder="Ví dụ: MOMO123456"
                        className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Access Key <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('configData.accessKey', { required: 'Vui lòng nhập Access Key' })}
                        placeholder="Access Key do MoMo cấp"
                        className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Secret Key <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        {...register('configData.secretKey', { required: 'Vui lòng nhập Secret Key' })}
                        placeholder="••••••••••••••••"
                        className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
        );
    }

    if (code === 'PAYOS') {
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Client ID <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('configData.clientId', { required: 'Vui lòng nhập Client ID' })}
                        placeholder="Client ID do PayOS cấp"
                        className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        API Key <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        {...register('configData.apiKey', { required: 'Vui lòng nhập API Key' })}
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
                        {...register('configData.checksumKey', { required: 'Vui lòng nhập Checksum Key' })}
                        placeholder="••••••••••••••••"
                        className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
        );
    }

    if (code === 'SEPAY') {
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        API Token (SePay) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        {...register('configData.apiToken', { required: 'Vui lòng nhập API Token' })}
                        placeholder="••••••••••••••••"
                        className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
        );
    }

    if (code === 'CASH') {
        return (
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200/80 text-center space-y-2">
                <p className="text-xs font-semibold text-gray-700">
                    Phương thức thanh toán bằng Tiền mặt tại bàn.
                </p>
                <p className="text-xs text-gray-500">
                    Phương thức này không yêu cầu cấu hình API Key. Nhân viên phục vụ sẽ thu tiền và xác nhận trên máy POS.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                    API Key / Merchant Key
                </label>
                <input
                    type="password"
                    {...register('configData.apiKey')}
                    placeholder="••••••••••••••••"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
            </div>
        </div>
    );
};
