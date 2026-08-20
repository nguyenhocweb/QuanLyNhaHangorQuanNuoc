"use client";
import React from 'react';
import { FiFileText, FiDownload, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useGetInvoices } from '../hook/useBilling_hook';
import { Invoice } from '../type/billing.type';

interface InvoiceListProps {
    brandId: string;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ brandId }) => {
    const { data: responseData, isLoading } = useGetInvoices(brandId);
    const invoices: Invoice[] = responseData?.data?.metadata?.data || [];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"><FiCheckCircle /> Đã thanh toán</span>;
            case 'OPEN':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"><FiClock /> Chờ thanh toán</span>;
            case 'DRAFT':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"><FiFileText /> Nháp</span>;
            case 'VOID':
            case 'UNCOLLECTIBLE':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"><FiXCircle /> Đã hủy</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Đang tải lịch sử hóa đơn...</div>;
    }

    if (invoices.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Chưa có hóa đơn nào</h3>
                <p className="text-gray-500 mt-2">Lịch sử thanh toán và hóa đơn của bạn sẽ xuất hiện tại đây.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
                <h3 className="text-lg font-bold text-gray-900">Lịch sử Hóa đơn</h3>
                <p className="text-gray-500 text-sm mt-1">Danh sách các hóa đơn bạn đã tạo và thanh toán.</p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80">
                        <tr>
                            <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider">Mã HĐ</th>
                            <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider">Số tiền</th>
                            <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-gray-900">{invoice.invoiceNumber}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-600 text-sm">{new Date(invoice.createdAt).toLocaleDateString('vi-VN')}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-bold text-gray-900">{formatPrice(invoice.total)}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(invoice.status)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {invoice.status === 'OPEN' && invoice.paymentUrl ? (
                                        <a 
                                            href={invoice.paymentUrl}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-xl transition-all"
                                        >
                                            Thanh toán ngay
                                        </a>
                                    ) : invoice.status === 'PAID' ? (
                                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 text-[13px] font-medium rounded-lg transition-colors">
                                            <FiDownload /> Tải HĐ
                                        </button>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
