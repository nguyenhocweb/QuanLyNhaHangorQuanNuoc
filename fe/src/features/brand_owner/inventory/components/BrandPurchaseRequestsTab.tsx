import React, { useState } from 'react';
import { Div, Button, Badge } from '@/src/core/components/ui';
import { FaBoxes, FaCheck, FaTimes, FaSpinner, FaMagic } from 'react-icons/fa';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetBrandPurchaseRequests, useRejectPurchaseRequests } from '../hooks/useBrandPurchaseRequests';
import { usePreviewSplitPurchaseRequests } from '../hooks/useGeneratePurchaseOrders';
import FadeIn from '@/src/core/components/animation/FadeIn';
import { SmartSplitModal } from './SmartSplitModal';
import { toast } from 'sonner';

export const BrandPurchaseRequestsTab = () => {
  const { activeWorkspace } = useAuthStore();
  const brandId = activeWorkspace?.brandId || activeWorkspace?.id;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [splitData, setSplitData] = useState<any>(null);

  const { data, isLoading } = useGetBrandPurchaseRequests(
    brandId as string,
    currentPage,
    itemsPerPage,
    selectedStatus !== 'ALL' ? selectedStatus : undefined
  );

  const { mutate: previewSplit, isPending: isPreviewing } = usePreviewSplitPurchaseRequests();
  const { mutate: rejectRequests, isPending: isRejecting } = useRejectPurchaseRequests();

  const handleSelectRequest = (id: string) => {
    setSelectedRequests(prev => 
      prev.includes(id) ? prev.filter(reqId => reqId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && data?.metadata?.items) {
      const pendingItems = data.metadata.items.filter((item: any) => item.status === 'PENDING');
      setSelectedRequests(pendingItems.map((item: any) => item.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleProcessSelected = () => {
    if (selectedRequests.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 phiếu yêu cầu để xử lý");
      return;
    }

    previewSplit({ brandId: brandId as string, requestIds: selectedRequests }, {
      onSuccess: (res) => {
        setSplitData(res.metadata);
        setIsModalOpen(true);
      }
    });
  };

  const handleRejectSelected = () => {
    if (selectedRequests.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 phiếu yêu cầu để từ chối");
      return;
    }

    if (confirm("Bạn có chắc chắn muốn từ chối các yêu cầu này?")) {
      rejectRequests({ brandId: brandId as string, requestIds: selectedRequests }, {
        onSuccess: () => setSelectedRequests([])
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="warning">Chờ xử lý</Badge>;
      case 'APPROVED': return <Badge variant="success">Đã duyệt</Badge>;
      case 'PO_CREATED': return <Badge variant="blue">Đã xử lý</Badge>;
      case 'IN_TRANSIT': return <Badge variant="blue">Đang giao</Badge>;
      case 'COMPLETED': return <Badge variant="success">Hoàn tất</Badge>;
      case 'REJECTED': return <Badge variant="danger">Từ chối</Badge>;
      default: return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <FadeIn className="w-full">
      <Div vitri="col_none" className="w-full h-full gap-4">
        <Div className="w-full flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex gap-2">
            <select
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
                setSelectedRequests([]);
              }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="PO_CREATED">Đã xử lý (Tạo PO)</option>
              <option value="REJECTED">Từ chối</option>
              <option value="COMPLETED">Hoàn tất</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="gray_hover" 
              sizea="p4_2" 
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-gray-200" 
              onClick={handleRejectSelected}
              disabled={isRejecting || isPreviewing || selectedRequests.length === 0}
            >
              {isRejecting ? <FaSpinner className="animate-spin" /> : <FaTimes />}
              Từ chối ({selectedRequests.length})
            </Button>
            <Button 
              variant="blue" 
              sizea="p4_2" 
              className="gap-2" 
              onClick={handleProcessSelected}
              disabled={isPreviewing || isRejecting || selectedRequests.length === 0}
            >
              {isPreviewing ? <FaSpinner className="animate-spin" /> : <FaMagic />}
              Xử lý Yêu cầu (Gom đơn) ({selectedRequests.length})
            </Button>
          </div>
        </Div>

        {/* Table */}
        <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={data?.metadata?.items?.filter((i:any)=>i.status==='PENDING').length > 0 && selectedRequests.length === data?.metadata?.items?.filter((i:any)=>i.status==='PENDING').length}
                  />
                </th>
                <th className="px-6 py-4">Mã Yêu cầu</th>
                <th className="px-6 py-4">Chi nhánh</th>
                <th className="px-6 py-4">Ngày xin</th>
                <th className="px-6 py-4">Số mặt hàng</th>
                <th className="px-6 py-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Đang tải dữ liệu...</td>
                </tr>
              ) : data?.metadata?.items?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Không có yêu cầu nhập kho nào</td>
                </tr>
              ) : (
                data?.metadata?.items?.map((req: any) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedRequests.includes(req.id)}
                        onChange={() => handleSelectRequest(req.id)}
                        disabled={req.status !== 'PENDING'}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-600">{req.requestCode}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">{req.restaurant?.name || '---'}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 text-gray-600">{req.items?.length || 0} món</td>
                    <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Div>

      {/* Smart Split Modal */}
      {isModalOpen && splitData && (
        <SmartSplitModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          splitData={splitData}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedRequests([]);
          }}
        />
      )}
    </FadeIn>
  );
};
