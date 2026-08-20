import React, { useState } from 'react';
import { Div, Button, H } from '@/src/core/components/ui';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetPurchaseRequests } from '../hooks/useManagerPurchaseRequests';
import FadeIn from '@/src/core/components/animation/FadeIn';

export const ManagerPurchaseRequestsTab = () => {
  const { user, activeWorkspace } = useAuthStore();
  const role = user?.role || "";
  const restaurantId = activeWorkspace?.id;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState(''); // '' means all

  const { data: requestsData, isLoading } = useGetPurchaseRequests(restaurantId, role, currentPage, itemsPerPage, statusFilter);
  const requests = Array.isArray(requestsData?.metadata?.requests) ? requestsData.metadata.requests : [];
  const totalPages = requestsData?.metadata?.options?.totalPages || 1;
  const totalCount = requestsData?.metadata?.options?.totalCount || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max"><FaClock /> Chờ duyệt</span>;
      case 'PO_CREATED':
      case 'APPROVED':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max"><FaCheckCircle /> Đã duyệt (Tạo PO)</span>;
      case 'REJECTED':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max"><FaTimesCircle /> Đã từ chối</span>;
      case 'COMPLETED':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max"><FaCheckCircle /> Hoàn thành</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-max">{status}</span>;
    }
  };

  return (
    <FadeIn className="w-full flex flex-col gap-6">
      <Div className="w-full justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex gap-2">
          <select 
            className="border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Đang chờ duyệt</option>
            <option value="PO_CREATED">Đã duyệt (Tạo PO)</option>
            <option value="REJECTED">Đã từ chối</option>
          </select>
        </div>
      </Div>

      <Div vitri="col_none" className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm text-gray-500">
                <th className="p-4 font-semibold w-12 text-center">STT</th>
                <th className="p-4 font-semibold">Mã YC</th>
                <th className="p-4 font-semibold">Ngày tạo</th>
                <th className="p-4 font-semibold">Dự kiến nhận</th>
                <th className="p-4 font-semibold">Số lượng mặt hàng</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Chưa có phiếu yêu cầu nhập kho nào.
                  </td>
                </tr>
              ) : (
                requests.map((req: any, index: number) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-center text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {req.requestCode}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {req.expectedDate ? new Date(req.expectedDate).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="p-4 text-gray-600">
                      {req.items?.length || 0} mục
                    </td>
                    <td className="p-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" sizea="p4_2" className="text-sm border-blue-200 text-blue-600 hover:bg-blue-50">
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {!isLoading && totalPages > 0 && (
          <div className="w-full flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/30">
            <div className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, totalCount)} của {totalCount} kết quả
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                Hiển thị:
                <select 
                  className="border border-gray-200 rounded-lg px-2 py-1 outline-none bg-white"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  sizea="p4_2" 
                  className="text-sm px-3"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  Trước
                </Button>
                <div className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm">
                  {currentPage} / {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  sizea="p4_2" 
                  className="text-sm px-3"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  Sau
                </Button>
              </div>
            </div>
          </div>
        )}
      </Div>
    </FadeIn>
  );
};
