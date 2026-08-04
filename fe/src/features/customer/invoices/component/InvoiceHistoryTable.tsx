import React, { useState } from 'react';
import { useGetMyInvoices } from '../hook/useGetMyInvoices';
import { CustomerInvoiceType } from '../type/invoice.type';
import { AiOutlineInbox } from 'react-icons/ai';
import { BiLoaderAlt, BiReceipt } from 'react-icons/bi';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';

export const InvoiceHistoryTable = () => {
    const [page, setPage] = useState(1);
    const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoiceType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // We recreate the inline formatCurrency if it's not exported globally
    const formatCurrencyFn = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const { data, isLoading, isError } = useGetMyInvoices({
        page,
        limit: 10
    });

    const invoices = data?.metadata?.data || [];

    const handleViewReceipt = (invoice: CustomerInvoiceType) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full flex flex-col gap-6">
            
            {/* Table Area */}
            <div className="min-h-[400px] overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-semibold">Mã Hóa Đơn</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Ngày thanh toán</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Nhà hàng</th>
                            <th scope="col" className="px-6 py-4 font-semibold text-right">Tổng tiền</th>
                            <th scope="col" className="px-6 py-4 font-semibold text-center">Thao tác</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="h-64">
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <BiLoaderAlt className="animate-spin text-3xl mb-2 text-indigo-500" />
                                        <p className="text-sm">Đang tải danh sách hóa đơn...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={5} className="h-64">
                                    <div className="flex flex-col items-center justify-center h-full text-red-400">
                                        <p className="text-sm">Có lỗi xảy ra khi tải dữ liệu.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : invoices.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="h-64">
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <AiOutlineInbox className="text-4xl mb-2 text-gray-300" />
                                        <p className="text-sm">Bạn chưa có hóa đơn thanh toán nào</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            invoices.map(invoice => (
                                <tr key={invoice.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-medium text-gray-900 whitespace-nowrap">
                                        #{invoice.order_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(invoice.paid_at).toLocaleDateString('vi-VN')} <br/>
                                        <span className="text-xs text-gray-400">{new Date(invoice.paid_at).toLocaleTimeString('vi-VN')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-800 line-clamp-1">{invoice.restaurant?.name || 'Foleat Restaurant'}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-indigo-600 text-right whitespace-nowrap">
                                        {formatCurrencyFn(invoice.total_amount)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleViewReceipt(invoice)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors"
                                        >
                                            <BiReceipt />
                                            Xem Bill
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Receipt Modal */}
            <InvoiceReceiptModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                invoice={selectedInvoice}
            />
        </div>
    );
};
