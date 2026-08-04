import React, { useState } from 'react';
import { useGetMyOrders } from '../hook/useGetMyOrders';
import { OrderCard } from './OrderCard';
import { CustomerOrderType } from '../type/order.type';
import { AiOutlineInbox } from 'react-icons/ai';
import { BiLoaderAlt } from 'react-icons/bi';
// Import toast component if we need to show messages
import { toast } from 'sonner';

type TabType = 'ALL' | 'OPEN' | 'SENT_TO_KITCHEN' | 'PAID' | 'CANCELLED';

export const OrderHistoryList = () => {
    const [activeTab, setActiveTab] = useState<TabType>('ALL');
    const [page, setPage] = useState(1);
    
    // States for Modal Details
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<CustomerOrderType | null>(null);

    const getStatusFilter = (tab: TabType) => {
        if (tab === 'ALL') return undefined;
        return tab;
    };

    const { data, isLoading, isError } = useGetMyOrders({
        page,
        limit: 50,
        status: getStatusFilter(activeTab)
    });

    const orders = data?.metadata?.data || [];

    const handleViewDetails = (order: CustomerOrderType) => {
        setSelectedOrder(order);
        // setIsDetailModalOpen(true);
        // Tạm thời hiển thị Toast do chưa làm Modal chi tiết (Open Question 1)
        toast.info(`Tính năng xem chi tiết hóa đơn #${order.order_number} đang được phát triển.`);
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setActiveTab('ALL')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ALL' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Tất cả
                </button>
                <button
                    onClick={() => setActiveTab('OPEN')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'OPEN' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Đang gọi món
                </button>
                <button
                    onClick={() => setActiveTab('SENT_TO_KITCHEN')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'SENT_TO_KITCHEN' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Đang chế biến
                </button>
                <button
                    onClick={() => setActiveTab('PAID')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'PAID' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Đã thanh toán
                </button>
                <button
                    onClick={() => setActiveTab('CANCELLED')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'CANCELLED' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Đã hủy
                </button>
            </div>

            {/* List */}
            <div className="min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <BiLoaderAlt className="animate-spin text-3xl mb-2 text-indigo-500" />
                        <p className="text-sm">Đang tải danh sách đơn hàng...</p>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center h-64 text-red-400">
                        <p className="text-sm">Có lỗi xảy ra khi tải dữ liệu.</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <AiOutlineInbox className="text-4xl mb-2 text-gray-300" />
                        <p className="text-sm">Bạn chưa có đơn hàng nào trong mục này</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {orders.map(item => (
                            <OrderCard 
                                key={item.id} 
                                order={item} 
                                onViewDetails={handleViewDetails} 
                            />
                        ))}
                    </div>
                )}
            </div>
            
            {/* TODO: OrderDetailModal will be added here based on Open Questions feedback */}
        </div>
    );
};
