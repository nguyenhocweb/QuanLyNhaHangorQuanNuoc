import React, { useState } from 'react';
import { useGetMyReservations } from '../hook/useGetMyReservations';
import { ReservationCard } from './ReservationCard';
import { CancelReservationModal } from './CancelReservationModal';
import { CustomerReservation } from '../type/reservation.type';
import { AiOutlineInbox } from 'react-icons/ai';
import { BiLoaderAlt } from 'react-icons/bi';

type TabType = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export const ReservationHistoryList = () => {
    const [activeTab, setActiveTab] = useState<TabType>('UPCOMING');
    const [page, setPage] = useState(1);
    
    // States for Modal
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<CustomerReservation | null>(null);

    // Map Tab to API status filters
    const getStatusFilter = (tab: TabType) => {
        switch (tab) {
            case 'UPCOMING': return 'PENDING,CONFIRMED,SEATED'; // Tạm thời backend chưa support array cho where.in, nên ở đây truyền String nếu backend xử lý đc, hoặc tạm bỏ filter, nhưng theo BE hiện tại chỉ query 1 status.
            // Sửa BE để query array hoặc query 1 status. Ở đây tạm thời pass 'PENDING' để demo hoặc ko pass status để FE tự filter. 
            // Nếu API đã setup filter chuẩn thì truyền params tương ứng.
            case 'COMPLETED': return 'COMPLETED';
            case 'CANCELLED': return 'CANCELLED';
        }
    };

    const { data, isLoading, isError } = useGetMyReservations({
        page,
        limit: 50,
        // status: getStatusFilter(activeTab) // Nếu backend chưa support in array, tạm comment dòng này để FE lọc.
    });

    // Lọc dữ liệu phía Frontend dựa trên Tab (Do backend query hiện tại chưa dùng mảng `in`)
    const filteredData = data?.metadata?.data?.filter(item => {
        if (activeTab === 'UPCOMING') return ['PENDING', 'CONFIRMED', 'SEATED'].includes(item.status);
        if (activeTab === 'COMPLETED') return item.status === 'COMPLETED';
        if (activeTab === 'CANCELLED') return ['CANCELLED', 'NO_SHOW'].includes(item.status);
        return true;
    }) || [];

    const handleOpenCancelModal = (reservation: CustomerReservation) => {
        setSelectedReservation(reservation);
        setIsCancelModalOpen(true);
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('UPCOMING')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'UPCOMING' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Sắp tới
                </button>
                <button
                    onClick={() => setActiveTab('COMPLETED')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'COMPLETED' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Đã hoàn thành
                </button>
                <button
                    onClick={() => setActiveTab('CANCELLED')}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'CANCELLED' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Đã hủy
                </button>
            </div>

            {/* List */}
            <div className="min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <BiLoaderAlt className="animate-spin text-3xl mb-2 text-indigo-500" />
                        <p className="text-sm">Đang tải dữ liệu...</p>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center h-64 text-red-400">
                        <p className="text-sm">Có lỗi xảy ra khi tải dữ liệu.</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <AiOutlineInbox className="text-4xl mb-2 text-gray-300" />
                        <p className="text-sm">Không có đơn đặt bàn nào trong mục này</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredData.map(item => (
                            <ReservationCard 
                                key={item.id} 
                                reservation={item} 
                                onCancelClick={handleOpenCancelModal} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            <CancelReservationModal 
                isOpen={isCancelModalOpen} 
                onClose={() => setIsCancelModalOpen(false)} 
                reservation={selectedReservation}
            />
        </div>
    );
};
