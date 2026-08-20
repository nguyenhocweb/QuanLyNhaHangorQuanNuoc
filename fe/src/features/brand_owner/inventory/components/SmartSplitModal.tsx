import React, { useState } from 'react';
import { Div, Button, Badge } from '@/src/core/components/ui';
import { FaTimes, FaBox, FaStore, FaBuilding } from 'react-icons/fa';
import { useGeneratePurchaseOrders } from '../hooks/useGeneratePurchaseOrders';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { useGetRestaurants } from '../../restaurants/hook/useGetRestaurants';

export const SmartSplitModal = ({
  isOpen,
  onClose,
  splitData,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  splitData: any;
  onSuccess: () => void;
}) => {
  const { activeWorkspace } = useAuthStore();
  const brandId = activeWorkspace?.id;
  
  const { data: restaurants } = useGetRestaurants(brandId as string);

  // Mặc định chọn brandId làm Kho Tổng ảo
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(brandId as string);

  const [groups, setGroups] = useState<any[]>(splitData.groupedBySupplier || []);
  const [unassigned, setUnassigned] = useState<any[]>(splitData.unassigned || []);

  const { mutate: generatePOs, isPending: isGenerating } = useGeneratePurchaseOrders();

  const handleUpdateApprovedQty = (supplierId: string, itemId: string, newQty: number) => {
    setGroups(prevGroups => prevGroups.map(group => {
      if (group.supplierId !== supplierId) return group;
      return {
        ...group,
        items: group.items.map((item: any) => 
          item.inventoryItemId === itemId ? { ...item, approvedQty: newQty } : item
        )
      };
    }));
  };

  const handleGeneratePOs = () => {
    // Lọc bỏ những group không có item nào được duyệt > 0
    const validGroups = groups.map(g => ({
      ...g,
      items: g.items.filter((item: any) => item.approvedQty > 0)
    })).filter(g => g.items.length > 0);

    generatePOs(
      { brandId: brandId as string, centralWarehouseId: selectedWarehouseId, groups: validGroups },
      {
        onSuccess: () => {
          onSuccess();
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <Div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Div vitri="col_none" className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-xl relative max-h-[90vh] flex flex-col gap-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>
        
        <div className="shrink-0 flex justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gom đơn & Phân tách Hóa đơn (PO)</h2>
            <p className="text-sm text-gray-500 mt-1">Hệ thống tự động gộp mặt hàng giống nhau và phân loại theo Nhà cung cấp.</p>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaBuilding className="text-gray-400" />
              Chọn nơi nhập kho đích:
            </label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-[240px] text-sm bg-gray-50 font-medium"
              value={selectedWarehouseId}
              onChange={(e) => setSelectedWarehouseId(e.target.value)}
            >
              <option value={brandId as string}>Kho Tổng (Chi nhánh ảo)</option>
              {restaurants?.map((r: any) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full pr-2 flex flex-col gap-6">
          {groups.length === 0 && unassigned.length === 0 && (
            <div className="text-center py-10 text-gray-500">Không có dữ liệu mặt hàng nào.</div>
          )}

          {groups.map((group, index) => (
            <div key={index} className="border border-blue-100 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="bg-blue-50/50 px-4 py-3 border-b border-blue-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaStore className="text-blue-500" />
                  <span className="font-semibold text-blue-900">{group.supplierName}</span>
                  <Badge variant="blue">{group.items.length} mặt hàng</Badge>
                </div>
                <div className="text-sm font-medium text-blue-800">
                  Tổng tạm tính: {group.items.reduce((sum: number, i: any) => sum + (i.approvedQty * i.unitPrice), 0).toLocaleString('vi-VN')} đ
                </div>
              </div>
              
              <div className="p-0">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/50 text-gray-500">
                    <tr>
                      <th className="px-4 py-2">Mặt hàng</th>
                      <th className="px-4 py-2">Nguồn xin</th>
                      <th className="px-4 py-2">SL Yêu cầu</th>
                      <th className="px-4 py-2 w-32">SL Duyệt Mua</th>
                      <th className="px-4 py-2">Đơn giá (dự kiến)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {group.items.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{item.name}</div>
                          <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs flex flex-col gap-1">
                            {item.sourceBranches.map((br: string, i: number) => (
                              <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{br}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-orange-600 font-medium">
                          {item.requestedQty} {item.baseUnit}
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number"
                            min="0"
                            step="0.1"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-blue-700 font-bold focus:border-blue-500 outline-none"
                            value={item.approvedQty}
                            onChange={(e) => handleUpdateApprovedQty(group.supplierId, item.inventoryItemId, parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {item.unitPrice.toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {unassigned.length > 0 && (
            <div className="border border-red-100 rounded-xl overflow-hidden bg-white shadow-sm opacity-75">
              <div className="bg-red-50/50 px-4 py-3 border-b border-red-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-red-900">Mặt hàng chưa gán Nhà Cung Cấp (Sẽ bị bỏ qua)</span>
                  <Badge variant="danger">{unassigned.length} mặt hàng</Badge>
                </div>
              </div>
              <div className="p-4 text-sm text-red-600">
                Các mặt hàng này không có `supplierId` trong danh mục, do đó không thể tự động tạo Hóa đơn (PO). Bạn cần xử lý xuất kho tổng thủ công cho các món này.
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 shrink-0">
          <Button variant="outline" sizea="p4_2" onClick={onClose} disabled={isGenerating}>
            Hủy bỏ
          </Button>
          <Button variant="blue" sizea="p4_2" onClick={handleGeneratePOs} disabled={isGenerating}>
            {isGenerating ? "Đang xử lý..." : `Xác nhận & Tạo ${groups.length} PO`}
          </Button>
        </div>
      </Div>
    </Div>
  );
};
