"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPlus, FaSearch, FaSpinner } from "react-icons/fa";
import { saveVoucherSchema, SaveVoucherFormValues } from "../schema/promotion.save.schema";
import { useSaveVoucher } from "../hook/useSaveVoucher";

export const AddVoucherBar: React.FC = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<SaveVoucherFormValues>({
        resolver: zodResolver(saveVoucherSchema) as any,
        defaultValues: {
            identifier: ""
        }
    });

    const { mutate: saveVoucher, isPending } = useSaveVoucher();

    const onSubmit = (data: SaveVoucherFormValues) => {
        saveVoucher(data.identifier, {
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Thêm Voucher mới</h3>
            <p className="text-sm text-gray-500 mb-4">
                Nhập mã khuyến mãi bạn được tặng (ví dụ: FOLEAT2026, WELCOME50) để lưu vào ví và sử dụng khi đặt bàn.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <FaSearch className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        {...register("identifier")}
                        placeholder="Nhập mã voucher hoặc ID..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase placeholder:normal-case font-medium text-gray-800 transition-all"
                        disabled={isPending}
                    />
                    {errors.identifier && (
                        <p className="text-xs text-red-500 mt-1">{errors.identifier.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 shrink-0"
                >
                    {isPending ? (
                        <>
                            <FaSpinner className="w-4 h-4 animate-spin" />
                            <span>Đang lưu...</span>
                        </>
                    ) : (
                        <>
                            <FaPlus className="w-4 h-4" />
                            <span>Lưu vào ví</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
