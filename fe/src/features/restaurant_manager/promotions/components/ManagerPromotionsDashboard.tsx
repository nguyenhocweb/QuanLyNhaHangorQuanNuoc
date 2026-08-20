import React, { useState } from 'react';
import { Div, H } from '@/src/core/components/ui';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { useGetPromotions } from '../hook/useGetPromotions';
import { useTogglePromotion } from '../hook/useTogglePromotion';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { FaPlus, FaPowerOff, FaTicketAlt, FaChartLine, FaClock, FaUserTag, FaUtensils, FaEdit } from 'react-icons/fa';
import { ConfirmModal } from '@/src/core/components/layout/public-ConfirmModal';
import { ManagerPromotionFormModal } from './ManagerPromotionFormModal';

export const ManagerPromotionsDashboard = () => {
  const { activeWorkspace } = useAuthStore();
  const restaurantId = activeWorkspace?.id;
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [toggleData, setToggleData] = useState<{ id: string, willBeActive: boolean, code: string } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: promotionsData, isLoading } = useGetPromotions(restaurantId);
  const { mutate: togglePromotion } = useTogglePromotion();

  const promotions = promotionsData || [];
  const filteredPromotions = promotions.filter(p => activeTab === 'ACTIVE' ? p.status === 'ACTIVE' : p.status !== 'ACTIVE');

  const handleConfirmToggle = () => {
    if (toggleData) {
      togglePromotion({ id: toggleData.id });
      setToggleData(null);
    }
  };

  const getTargetBadge = (target: string) => {
    switch (target) {
      case 'VIP': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1 w-fit"><FaUserTag /> VIP</span>;
      case 'NEW_CUSTOMER': return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1 w-fit"><FaUserTag /> Khách mới</span>;
      case 'STUDENT': return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1 w-fit"><FaUserTag /> HSSV</span>;
      default: return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-semibold w-fit">Tất cả khách</span>;
    }
  };

  return (
    <FadeIn className="w-full">
      <Div vitri="col_none" className="w-full gap-6">
        
        {/* Header & Metrics */}
        <Div vitri="col_none" className="w-full gap-4">
          <Div vitri="row_between" className="w-full">
            <Div vitri="col_none" className="gap-1">
              <H variant="text_black" className="text-2xl font-bold">Quản lý Khuyến Mãi (Nâng cao)</H>
              <p className="text-gray-500">Kiểm soát rủi ro, quản lý giờ vàng và tệp khách hàng.</p>
            </Div>
            <button 
              onClick={() => {
                setEditingId(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <FaPlus />
              <span>Tạo chiến dịch mới</span>
            </button>
          </Div>

          <Div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <Div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <Div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 text-xl"><FaTicketAlt /></Div>
              <Div vitri="col_none">
                <p className="text-gray-500 text-sm font-medium">Đang chạy (Active)</p>
                <H variant="text_black" className="text-xl font-bold">{promotions.filter(p => p.status === 'ACTIVE').length} mã</H>
              </Div>
            </Div>
            <Div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <Div className="w-12 h-12 rounded-full bg-green-50 text-green-600 text-xl"><FaChartLine /></Div>
              <Div vitri="col_none">
                <p className="text-gray-500 text-sm font-medium">Lượt đã dùng hôm nay</p>
                <H variant="text_black" className="text-xl font-bold">94 lượt</H>
              </Div>
            </Div>
            <Div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <Div className="w-12 h-12 rounded-full bg-red-50 text-red-600 text-xl"><FaPowerOff /></Div>
              <Div vitri="col_none">
                <p className="text-gray-500 text-sm font-medium">Đã tắt / Hết hạn</p>
                <H variant="text_black" className="text-xl font-bold">{promotions.filter(p => p.status !== 'ACTIVE').length} mã</H>
              </Div>
            </Div>
          </Div>
        </Div>

        {/* Tabs */}
        <Div className="w-full bg-white p-2 rounded-xl shadow-sm border border-gray-100 gap-2 flex-wrap">
          <button 
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'ACTIVE' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Đang chạy
          </button>
          <button 
            onClick={() => setActiveTab('INACTIVE')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'INACTIVE' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Đã kết thúc / Vô hiệu hóa
          </button>
        </Div>

        {/* Table */}
        <Div vitri="col_none" className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-semibold">Mã & Đối tượng</th>
                  <th className="p-4 font-semibold">Điều kiện Áp dụng</th>
                  <th className="p-4 font-semibold">Khung giờ / Ngày</th>
                  <th className="p-4 font-semibold">Giới hạn / Đã dùng</th>
                  <th className="p-4 font-semibold text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">Đang tải...</td></tr>
                ) : filteredPromotions.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">Không có dữ liệu</td></tr>
                ) : (
                  filteredPromotions.map((promo) => (
                    <tr key={promo.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <Div vitri="col_none" className="gap-2">
                          <span className="font-bold text-gray-800 text-lg">{promo.code}</span>
                          {getTargetBadge(promo.conditions?.targetAudience || promo.targetAudience || 'ALL')}
                        </Div>
                      </td>
                      <td className="p-4">
                        <Div vitri="col_none" className="gap-1">
                          <p className="text-indigo-600 font-semibold">
                            {promo.discountType === 'FIXED_AMOUNT' ? `Giảm ${promo.discountValue.toLocaleString()}đ` : `Giảm ${promo.discountValue}%`}
                            {promo.maxDiscount && <span className="text-gray-500 text-xs ml-1">(Tối đa {promo.maxDiscount.toLocaleString()}đ)</span>}
                          </p>
                          <p className="text-gray-600 text-sm">Đơn tối thiểu: {promo.minOrderValue ? promo.minOrderValue.toLocaleString() + 'đ' : '0đ'}</p>
                          {promo.applicableItemNames && (
                            <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit mt-1 flex items-center gap-1">
                              <FaUtensils /> Áp dụng {promo.applicableItemNames.length} món cụ thể
                            </p>
                          )}
                        </Div>
                      </td>
                      <td className="p-4">
                        <Div vitri="col_none" className="gap-1">
                          <p className="text-sm text-gray-700 font-medium">
                            {promo.daysOfWeek.length === 7 
                                ? 'Cả tuần' 
                                : promo.daysOfWeek.map((d: string) => {
                                    const map: any = {
                                        'MONDAY': 'Thứ 2',
                                        'TUESDAY': 'Thứ 3',
                                        'WEDNESDAY': 'Thứ 4',
                                        'THURSDAY': 'Thứ 5',
                                        'FRIDAY': 'Thứ 6',
                                        'SATURDAY': 'Thứ 7',
                                        'SUNDAY': 'CN'
                                    };
                                    return map[d] || d;
                                }).join(', ')}
                          </p>
                          {(promo.timeStart && promo.timeEnd) ? (
                            <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit flex items-center gap-1 font-semibold">
                              <FaClock /> {promo.timeStart} - {promo.timeEnd}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500">Cả ngày</p>
                          )}
                        </Div>
                      </td>
                      <td className="p-4">
                        <Div vitri="col_none" className="gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-bold">{promo.usedCount}</span>
                            <span className="text-gray-400">/ {promo.usageLimit || '∞'} tổng</span>
                          </div>
                          <p className="text-xs text-gray-500">Tối đa {promo.usageLimitPerUser || 1} lần/khách</p>
                        </Div>
                      </td>
                      <td className="p-4 flex items-center justify-center">
                        {promo.promotionRestaurants?.length === 0 ? (
                            <span 
                                title="Khuyến mãi áp dụng toàn chuỗi - Chỉ có quyền xem" 
                                className="px-2 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-not-allowed"
                            >
                                🔒 Toàn chuỗi
                            </span>
                        ) : promo.status === 'ACTIVE' ? (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setEditingId(promo.id);
                                setIsFormOpen(true);
                              }}
                              title="Chỉnh sửa"
                              className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all flex items-center justify-center w-8 h-8"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => setToggleData({ id: promo.id, willBeActive: false, code: promo.code })}
                              title="Tắt khẩn cấp"
                              className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all flex items-center justify-center w-8 h-8"
                            >
                              <FaPowerOff />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setEditingId(promo.id);
                                setIsFormOpen(true);
                              }}
                              title="Chỉnh sửa"
                              className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all flex items-center justify-center w-8 h-8"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => setToggleData({ id: promo.id, willBeActive: true, code: promo.code })}
                              title="Bật lại"
                              className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all font-semibold text-xs h-8"
                            >
                              Bật lại
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Div>
      </Div>

      <ConfirmModal
        open={!!toggleData}
        onClose={() => setToggleData(null)}
        onConfirm={handleConfirmToggle}
        title={toggleData?.willBeActive ? "Xác nhận bật lại" : "CẢNH BÁO: Tắt mã khẩn cấp!"}
        content={toggleData?.willBeActive 
          ? `Bạn có chắc chắn muốn bật lại mã ${toggleData?.code} không?`
          : `Bạn có chắc chắn muốn vô hiệu hóa mã ${toggleData?.code} ngay lập tức? Nhân viên sẽ không thể áp dụng mã này nữa.`}
        confirmText={toggleData?.willBeActive ? "Bật" : "Tắt mã"}
      />

      <ManagerPromotionFormModal 
        open={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setEditingId(null);
        }} 
        restaurantId={restaurantId || ''}
        editingId={editingId}
      />
    </FadeIn>
  );
};
