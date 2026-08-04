import React, { useRef } from 'react';
import { CustomerInvoiceType } from '../type/invoice.type';
import { IoClose } from 'react-icons/io5';
import { LuPrinter } from 'react-icons/lu';

interface InvoiceReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: CustomerInvoiceType | null;
}

export const InvoiceReceiptModal = ({ isOpen, onClose, invoice }: InvoiceReceiptModalProps) => {
    
    // We recreate the inline formatCurrency if it's not exported globally
    const formatCurrencyFn = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handlePrint = () => {
        // Feature to be implemented - maybe use window.print() or generate PDF
        window.print();
    };

    if (!isOpen || !invoice) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="bg-gray-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 bg-white border-b border-gray-200 shrink-0">
                    <h2 className="text-lg font-bold text-gray-800">Chi tiết hóa đơn</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={handlePrint}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors tooltip"
                            title="In hóa đơn"
                        >
                            <LuPrinter className="text-xl" />
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <IoClose className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Receipt Paper Area */}
                <div className="p-6 overflow-y-auto no-scrollbar print:p-0 print:overflow-visible">
                    <div className="bg-white mx-auto shadow-sm print:shadow-none font-mono text-sm border border-gray-200" 
                         style={{ 
                             // Tạo viền răng cưa cho tờ Bill (tùy chọn)
                             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                         }}>
                        
                        <div className="p-6">
                            {/* Brand / Restaurant Info */}
                            <div className="text-center mb-6">
                                <h1 className="font-bold text-xl uppercase mb-1">{invoice.restaurant?.name || 'FOLEAT RESTAURANT'}</h1>
                                <p className="text-xs text-gray-500">{invoice.restaurant?.address || 'Hệ thống Foleat'}</p>
                                <p className="text-xs text-gray-500 mt-1 border-b border-dashed border-gray-400 pb-4">
                                    Tel: 1900 1234
                                </p>
                            </div>

                            {/* Receipt Meta */}
                            <div className="mb-4 text-xs text-gray-600 flex flex-col gap-1 border-b border-dashed border-gray-400 pb-4">
                                <div className="flex justify-between">
                                    <span>Mã hóa đơn:</span>
                                    <span className="font-bold">#{invoice.order_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ngày thanh toán:</span>
                                    <span>{new Date(invoice.paid_at).toLocaleString('vi-VN')}</span>
                                </div>
                                {invoice.transactions?.[0]?.systemPaymentMethod && (
                                    <div className="flex justify-between">
                                        <span>Phương thức:</span>
                                        <span>{invoice.transactions[0].systemPaymentMethod.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Items List */}
                            <div className="mb-4 border-b border-dashed border-gray-400 pb-4">
                                <div className="flex justify-between font-bold mb-2">
                                    <span className="w-1/2">Tên món</span>
                                    <span className="w-1/4 text-center">SL</span>
                                    <span className="w-1/4 text-right">T.Tiền</span>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    {invoice.items?.map(item => (
                                        <div key={item.id} className="flex justify-between text-xs text-gray-700">
                                            <span className="w-1/2 break-words pr-2">{item.name}</span>
                                            <span className="w-1/4 text-center">{item.quantity}</span>
                                            <span className="w-1/4 text-right">{formatCurrencyFn(item.totalPrice)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="flex flex-col gap-1.5 text-xs text-gray-700">
                                <div className="flex justify-between">
                                    <span>Tổng cộng (Subtotal):</span>
                                    <span>{formatCurrencyFn(invoice.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Giảm giá:</span>
                                    <span>- {formatCurrencyFn(invoice.discount_amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Thuế VAT:</span>
                                    <span>{formatCurrencyFn(invoice.tax_amount)}</span>
                                </div>
                                
                                <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-dashed border-gray-400">
                                    <span>THÀNH TIỀN:</span>
                                    <span>{formatCurrencyFn(invoice.total_amount)}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-8 text-xs text-gray-500">
                                <p>Cảm ơn quý khách và hẹn gặp lại!</p>
                                <p className="mt-1 font-sans italic text-[10px]">Powered by Foleat</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Print Styles applied directly globally or just rely on normal window.print */}
                <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                        body * { visibility: hidden; }
                        .print\\:visible, .print\\:visible * { visibility: visible; }
                        .print\\:p-0 { padding: 0 !important; }
                        .print\\:shadow-none { box-shadow: none !important; }
                        /* Căn giữa tờ bill trên trang giấy in */
                        .print\\:visible {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                `}} />
            </div>
        </div>
    );
};
