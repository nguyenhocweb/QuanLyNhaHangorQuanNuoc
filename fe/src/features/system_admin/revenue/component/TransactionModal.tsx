import React from "react";
import { useGetTransaction } from "../hook/useTransaction_hook";

interface TransactionModalProps {
    subscriptionId: string | null;
    onClose: () => void;
}

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
};

export default function TransactionModal({ subscriptionId, onClose }: TransactionModalProps) {
    const { data: response, isLoading, error } = useGetTransaction(subscriptionId);
    
    if (!subscriptionId) return null;
    
    const transaction = response?.data;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-900">Chi tiết giao dịch</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="p-6">
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <span className="text-gray-500 font-medium">Đang tải thông tin...</span>
                        </div>
                    ) : error ? (
                        <div className="py-12 text-center text-red-500 bg-red-50 rounded-xl">Lỗi khi tải thông tin giao dịch</div>
                    ) : !transaction ? (
                        <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl">Không tìm thấy giao dịch nào</div>
                    ) : (
                        <div className="space-y-5">
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl text-center border border-indigo-100/50 shadow-sm">
                                <span className="block text-sm text-indigo-600/80 mb-1 font-medium">Số tiền thanh toán</span>
                                <span className="block text-3xl font-extrabold text-indigo-900 tracking-tight">
                                    {transaction.amount.toLocaleString("vi-VN")} ₫
                                </span>
                            </div>
                            
                            <div className="bg-white rounded-2xl p-5 space-y-4 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Trạng thái
                                    </span>
                                    {transaction.status === "SUCCESS" ? (
                                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-semibold text-xs border border-green-200/60 shadow-sm">
                                            Thành công
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full font-semibold text-xs border border-red-200/60 shadow-sm">
                                            {transaction.status}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                                    <span className="text-gray-500 font-medium flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                                        Mã giao dịch
                                    </span>
                                    <span className="font-mono text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">{transaction.externalTransactionId || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                                    <span className="text-gray-500 font-medium flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        Phương thức
                                    </span>
                                    <span className="text-gray-900 font-semibold">{transaction.systemPaymentMethod?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                                    <span className="text-gray-500 font-medium flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        Ngày thanh toán
                                    </span>
                                    <span className="text-gray-900 font-medium">{formatDate(transaction.createdAt)}</span>
                                </div>
                            </div>
                            
                            {transaction.rawResponse && (
                                <div className="mt-6">
                                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-2 ml-1">Dữ liệu đối soát:</span>
                                    <div className="bg-[#0d1117] text-[#c9d1d9] p-4 rounded-xl text-xs overflow-x-auto font-mono shadow-inner border border-gray-800">
                                        <pre className="leading-relaxed">{JSON.stringify(transaction.rawResponse, null, 2)}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
