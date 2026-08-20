import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ApiConfigFormValues } from '../schema/payment.schema';
import { PaymentProviderCode } from '../type/payment.type';
import { Label, Input } from "@/src/core/components/ui";

interface DynamicApiFormProps {
    form: UseFormReturn<ApiConfigFormValues>;
    providerCode: PaymentProviderCode;
}

export const DynamicApiForm: React.FC<DynamicApiFormProps> = ({ form, providerCode }) => {
    const code = providerCode.toUpperCase();

    if (code === 'VNPAY') {
        return (
            <div className="space-y-4">
                <div className="space-y-1">
                    <Label>Mã Terminal (vnp_TmnCode) <span className="text-red-500">*</span></Label>
                    <Input 
                        placeholder="VD: QWERTY12"
                        {...form.register("configData.vnp_TmnCode")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).vnp_TmnCode && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).vnp_TmnCode.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label>Mã Bảo Mật (vnp_HashSecret) <span className="text-red-500">*</span></Label>
                    <Input 
                        type="password"
                        placeholder="VD: SCRET1234567890..."
                        {...form.register("configData.vnp_HashSecret")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).vnp_HashSecret && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).vnp_HashSecret.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label>Payment URL (vnp_Url) <span className="text-red-500">*</span></Label>
                    <Input 
                        placeholder="VD: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
                        {...form.register("configData.vnp_Url")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).vnp_Url && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).vnp_Url.message}</p>
                    )}
                </div>
            </div>
        );
    }

    if (code === 'MOMO') {
        return (
            <div className="space-y-4">
                <div className="space-y-1">
                    <Label>Partner Code <span className="text-red-500">*</span></Label>
                    <Input 
                        placeholder="VD: MOMO123456"
                        {...form.register("configData.partnerCode")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).partnerCode && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).partnerCode.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label>Access Key <span className="text-red-500">*</span></Label>
                    <Input 
                        type="password"
                        placeholder="VD: access_key_123..."
                        {...form.register("configData.accessKey")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).accessKey && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).accessKey.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label>Secret Key <span className="text-red-500">*</span></Label>
                    <Input 
                        type="password"
                        placeholder="VD: secret_key_456..."
                        {...form.register("configData.secretKey")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).secretKey && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).secretKey.message}</p>
                    )}
                </div>
            </div>
        );
    }

    if (code === 'PAYOS') {
        return (
            <div className="space-y-4">
                <div className="space-y-1">
                    <Label>Client ID <span className="text-red-500">*</span></Label>
                    <Input 
                        placeholder="VD: 1234abcd-5678-..."
                        {...form.register("configData.clientId")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).clientId && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).clientId.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label>API Key <span className="text-red-500">*</span></Label>
                    <Input 
                        type="password"
                        placeholder="VD: 4567efgh-..."
                        {...form.register("configData.apiKey")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).apiKey && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).apiKey.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label>Checksum Key <span className="text-red-500">*</span></Label>
                    <Input 
                        type="password"
                        placeholder="VD: 8901ijkl-..."
                        {...form.register("configData.checksumKey")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).checksumKey && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).checksumKey.message}</p>
                    )}
                </div>
            </div>
        );
    }

    if (code === 'SEPAY') {
        return (
            <div className="space-y-4">
                <div className="space-y-1">
                    <Label>API Token <span className="text-red-500">*</span></Label>
                    <Input 
                        type="password"
                        placeholder="VD: sepay_token_abc123..."
                        {...form.register("configData.apiToken")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).apiToken && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).apiToken.message}</p>
                    )}
                </div>
            </div>
        );
    }

    if (code === 'BANK_TRANSFER') {
        return (
            <div className="space-y-4">
                <div className="space-y-1">
                    <Label>Tên ngân hàng <span className="text-red-500">*</span></Label>
                    <Input 
                        placeholder="VD: Vietcombank"
                        {...form.register("configData.bankName")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).bankName && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).bankName.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label>Số tài khoản <span className="text-red-500">*</span></Label>
                    <Input 
                        placeholder="VD: 0123456789"
                        {...form.register("configData.accountNumber")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).accountNumber && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).accountNumber.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label>Tên chủ tài khoản <span className="text-red-500">*</span></Label>
                    <Input 
                        placeholder="VD: NGUYEN VAN A"
                        className="uppercase"
                        {...form.register("configData.accountName")} 
                    />
                    {form.formState.errors.configData && (form.formState.errors.configData as any).accountName && (
                        <p className="text-red-500 text-xs">{(form.formState.errors.configData as any).accountName.message}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
            Không có cấu hình API đặc biệt nào cho phương thức này.
        </div>
    );
};
