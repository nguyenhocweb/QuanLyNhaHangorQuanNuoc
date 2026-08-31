import React from 'react';
import { useForm } from 'react-hook-form';
import { MdClose, MdPayment, MdCheckCircle } from 'react-icons/md';
import { useCreateBrandPaymentMethod } from '../hook/useCreateBrandPaymentMethod';

interface Props {
    brandId: string;
    isOpen: boolean;
    onClose: () => void;
}

interface CreateFormValues {
    name: string;
    code: string;
    description: string;
    iconUrl: string;
    isActive: boolean;
}

export const CreatePaymentMethodModal: React.FC<Props> = ({
    brandId,
    isOpen,
    onClose
}) => {
    const { mutate: createMethod, isPending } = useCreateBrandPaymentMethod(brandId);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateFormValues>({
        defaultValues: {
            name: '',
            code: '',
            description: '',
            iconUrl: '',
            isActive: true
        }
    });

    if (!isOpen) return null;

    const onSubmit = (data: CreateFormValues) => {
        createMethod({
            name: data.name,
            code: data.code.trim().toUpperCase(),
            description: data.description,
            iconUrl: data.iconUrl,
            isActive: data.isActive
        }, {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                            <MdPayment />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">Thêm cổng thanh toán mới</h3>
                            <p className="text-xs text-gray-500">Tạo cổng thanh toán hoặc ví điện tử mới</p>
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

                {/* Form Body */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Tên cổng thanh toán <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            placeholder="Ví dụ: ZaloPay, ShopeePay, POS Thẻ..."
                            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Mã phương thức (Code) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('code', { required: true })}
                            placeholder="Ví dụ: ZALOPAY, SHOPEEPAY, POS_CARD..."
                            className="w-full uppercase font-mono text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Mô tả phương thức
                        </label>
                        <textarea
                            {...register('description')}
                            rows={2}
                            placeholder="Mô tả ngắn gọn về cổng thanh toán này..."
                            className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Link Logo / Icon (Tùy chọn)
                        </label>
                        <input
                            type="text"
                            {...register('iconUrl')}
                            placeholder="https://..."
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                            type="checkbox"
                            {...register('isActive')}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-xs font-semibold text-gray-700">Kích hoạt ngay sau khi tạo</span>
                    </label>

                    {/* Footer */}
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
                            <span>{isPending ? 'Đang tạo...' : 'Tạo cổng thanh toán'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
