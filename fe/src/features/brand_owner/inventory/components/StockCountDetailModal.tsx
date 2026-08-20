import React from 'react'
import { Div, H, Button } from '@/src/core/components/ui'
import { useGetStockCountById } from '../hooks/useStockCount'
import FadeIn from '@/src/core/components/animation/FadeIn'
import { StockCountItem } from '../types/stock_count.type'
import { FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import { InputBox } from '@/src/core/components/ui'
import { toast } from 'sonner'
import { useState } from 'react'

interface Props {
  brandId: string;
  stockCountId: string;
  onClose: () => void;
  onApprove?: (reason: string) => void;
  onReject?: (reason: string) => void;
  isPending?: boolean;
}

export const StockCountDetailModal = ({ brandId, stockCountId, onClose, onApprove, onReject, isPending }: Props) => {
  const { data, isLoading } = useGetStockCountById(brandId, stockCountId)
  const stockCount = data?.metadata
  const [reason, setReason] = useState("");

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'DRAFT': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">Nháp</span>;
      case 'PENDING_APPROVAL': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-700">Chờ duyệt</span>;
      case 'APPROVED': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700">Đã duyệt</span>;
      case 'REJECTED': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">Đã từ chối</span>;
      case 'COMPLETED': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">Hoàn tất</span>;
      case 'CANCELLED': return <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-gray-200 text-gray-700">Đã hủy</span>;
      default: return <span>{status}</span>;
    }
  }

  const totalVarianceValue = (stockCount?.items || []).reduce((acc: number, item: any) => {
    const diff = item.actualQty - item.systemQty;
    const price = item.inventoryItem?.minPrice || 0;
    return acc + Math.abs(diff * price);
  }, 0);

  return (
    <Div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <FadeIn className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <Div vitri="row_between" className="w-full p-6 border-b border-gray-100 bg-gray-50">
          <Div className="items-center gap-3">
            <H className="text-xl font-bold text-gray-800">
              Chi tiết Phiếu kiểm kho
            </H>
            {stockCount && getStatusBadge(stockCount.status)}
          </Div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-200">
            <FaTimes size={20} />
          </button>
        </Div>

        {isLoading ? (
          <Div className="w-full p-12 justify-center text-gray-500">Đang tải chi tiết...</Div>
        ) : !stockCount ? (
          <Div className="w-full p-12 justify-center text-red-500">Không tìm thấy thông tin phiếu kiểm</Div>
        ) : (
          <Div vitri="col_none" className="w-full overflow-y-auto p-6 gap-6">
            {/* General Info */}
            <Div className="w-full grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <Div vitri="col_none" className="gap-1">
                <span className="text-sm text-gray-500">Mã phiếu</span>
                <span className="font-semibold text-blue-600">{stockCount.code}</span>
              </Div>
              <Div vitri="col_none" className="gap-1">
                <span className="text-sm text-gray-500">Ngày tạo</span>
                <span className="font-medium text-gray-800">
                  {new Date(stockCount.createdAt).toLocaleString('vi-VN')}
                </span>
              </Div>
              <Div vitri="col_none" className="gap-1">
                <span className="text-sm text-gray-500">Trạng thái</span>
                <span className="font-medium">{getStatusBadge(stockCount.status)}</span>
              </Div>
              <Div vitri="col_none" className="gap-1">
                <span className="text-sm text-gray-500">Ghi chú</span>
                <span className="font-medium text-gray-800">{stockCount.notes || '-'}</span>
              </Div>
            </Div>

            {/* Items Table */}
            <Div vitri="col_none" className="w-full gap-2 border border-gray-100 rounded-xl overflow-hidden">
              <H className="px-4 py-3 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700">Danh sách mặt hàng kiểm kê</H>
              
              <div className="overflow-y-auto overflow-x-auto w-full max-h-[50vh]">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="sticky top-0 z-10 shadow-sm bg-gray-50 border-b border-gray-200">
                    <tr className="text-sm">
                      <th className="p-4 font-semibold text-gray-600 w-[25%] bg-gray-50">Tên hàng hóa</th>
                      <th className="p-4 font-semibold text-gray-600 text-center w-[15%] bg-gray-50">Tồn HT</th>
                      <th className="p-4 font-semibold text-gray-600 text-center w-[15%] bg-gray-50">Tồn thực tế</th>
                      <th className="p-4 font-semibold text-gray-600 text-center w-[15%] bg-gray-50">Độ lệch</th>
                      <th className="p-4 font-semibold text-gray-600 text-right w-[15%] bg-gray-50">Giá mua</th>
                      <th className="p-4 font-semibold text-gray-600 text-right w-[15%] bg-gray-50">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockCount.items?.map((item: StockCountItem) => {
                      const diff = item.actualQty - item.systemQty;
                      const price = item.inventoryItem?.minPrice || 0;
                      const diffMoney = diff * price;
                      
                      return (
                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-800">
                            {item.inventoryItem?.name || 'Hàng hóa đã xóa'}
                            <div className="text-xs text-gray-500 mt-0.5">SKU: {item.inventoryItem?.sku || '-'}</div>
                          </td>
                          <td className="p-4 text-center text-gray-500">{item.systemQty}</td>
                          <td className="p-4 text-center font-semibold">{item.actualQty}</td>
                          <td className="p-4 text-center">
                            <span className={`font-bold ${diff < 0 ? 'text-red-500' : diff > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                              {diff > 0 ? '+' : ''}{diff}
                            </span>
                          </td>
                          <td className="p-4 text-right text-gray-500">{price.toLocaleString()}đ</td>
                          <td className={`p-4 text-right font-bold ${diffMoney < 0 ? 'text-red-500' : diffMoney > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                            {diffMoney > 0 ? '+' : ''}{diffMoney.toLocaleString()}đ
                          </td>
                        </tr>
                      );
                    })}
                    {(!stockCount.items || stockCount.items.length === 0) && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">Không có dữ liệu mặt hàng</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Div>
            
            {/* Total Section */}
            <Div vitri="row_between" className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2">
              <span className="text-sm font-semibold text-gray-700">Tổng giá trị chênh lệch (Tuyệt đối):</span>
              <span className="text-xl font-bold text-red-600">{totalVarianceValue.toLocaleString()} VNĐ</span>
            </Div>

            {stockCount.status === 'PENDING_APPROVAL' && onApprove && onReject && (
              <>
                <InputBox
                  label="Lý do duyệt / Từ chối (Bắt buộc nếu Từ chối)"
                  placeholder="Nhập lý do..."
                  value={reason}
                  onChange={(e: any) => setReason(e.target.value)}
                />
                <Div vitri="row_end" className="w-full gap-3 pt-2">
                  <Button variant="gray_hover" sizea="p4_2" onClick={onClose} disabled={isPending}>Đóng</Button>
                  <Button 
                    variant="red" 
                    sizea="p4_2" 
                    className="gap-2" 
                    onClick={() => {
                      if (!reason.trim()) {
                        toast.error("Vui lòng nhập lý do từ chối!");
                        return;
                      }
                      onReject(reason);
                    }} 
                    disabled={isPending}
                  >
                    <FaTimes /> Từ chối
                  </Button>
                  <Button variant="green" sizea="p4_2" className="gap-2" onClick={() => onApprove(reason)} disabled={isPending}>
                    <FaCheck /> Phê duyệt
                  </Button>
                </Div>
              </>
            )}
            
            {stockCount.status !== 'PENDING_APPROVAL' && (
              <Div vitri="row_end" className="w-full gap-3 pt-2">
                <Button variant="gray_hover" sizea="p4_2" onClick={onClose}>Đóng</Button>
              </Div>
            )}

          </Div>
        )}
      </FadeIn>
    </Div>
  )
}
