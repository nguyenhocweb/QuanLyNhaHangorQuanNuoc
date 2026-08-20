"use client"
import React, { useState } from 'react'
import { Div, Button, InputBox } from '@/src/core/components/ui'
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import { toast } from 'sonner'

interface Props {
  stockCountId: string;
  status: string;
  items: any[];
  onApprove: (reason: string) => void;
  onReject: (reason: string) => void;
  onClose: () => void;
  isPending: boolean;
  threshold: number;
}

export const ReviewStockCountModal = ({ stockCountId, status, items, onApprove, onReject, onClose, isPending, threshold }: Props) => {
  const [reason, setReason] = useState("");

  // Tính tổng thiệt hại (Dựa vào giá mua/giá vốn)
  const totalVarianceValue = items.reduce((acc, item) => {
    const diff = item.actualQty - item.systemQty;
    const price = item.inventoryItem?.minPrice || 0;
    return acc + Math.abs(diff * price);
  }, 0);

  const isOverThreshold = totalVarianceValue > threshold;
  const isReviewMode = status === 'PENDING_APPROVAL';

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

  return (
    <Div vitri="col_none" className="w-full gap-4 max-h-[90vh] overflow-y-auto p-6 bg-white rounded-xl relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
        <FaTimes size={20} />
      </button>
      <div className="flex flex-col mb-2 pr-8">
        <Div className="items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">
            {isReviewMode ? "Duyệt Phiếu Kiểm Kê" : "Chi Tiết Phiếu Kiểm Kê"}
          </h2>
          {getStatusBadge(status)}
        </Div>
        <span className="text-sm text-gray-500 mt-1">Mã phiếu: {stockCountId}</span>
      </div>

      <div className="overflow-y-auto overflow-x-auto w-full border border-gray-200 rounded-lg max-h-[50vh]">
        <table className="w-full text-sm text-left relative min-w-[700px]">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 w-[25%] bg-gray-50">Sản phẩm</th>
              <th className="px-4 py-3 text-center w-[15%] bg-gray-50">Tồn HT</th>
              <th className="px-4 py-3 text-center w-[15%] bg-gray-50">Tồn thực tế</th>
              <th className="px-4 py-3 text-center w-[15%] bg-gray-50">Độ lệch</th>
              <th className="px-4 py-3 text-right w-[15%] bg-gray-50">Giá mua</th>
              <th className="px-4 py-3 text-right w-[15%] bg-gray-50">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const diff = item.actualQty - item.systemQty;
              const price = item.inventoryItem?.minPrice || 0;
              const diffMoney = diff * price;
              return (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.inventoryItem?.name}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{item.systemQty}</td>
                  <td className="px-4 py-3 text-center font-semibold">{item.actualQty}</td>
                  <td className={`px-4 py-3 text-center font-bold ${diff < 0 ? 'text-red-500' : diff > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                    {diff > 0 ? '+' : ''}{diff}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">{price.toLocaleString()}đ</td>
                  <td className={`px-4 py-3 text-right font-bold ${diffMoney < 0 ? 'text-red-500' : diffMoney > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                    {diffMoney > 0 ? '+' : ''}{diffMoney.toLocaleString()}đ
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Div vitri="col_none" className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200">
        <Div vitri="row_between" className="w-full mb-2">
          <span className="text-sm font-semibold text-gray-700">Tổng giá trị chênh lệch (Tuyệt đối):</span>
          <span className="text-lg font-bold text-red-600">{totalVarianceValue.toLocaleString()} VNĐ</span>
        </Div>
        <Div vitri="row_between" className="w-full">
          <span className="text-xs text-gray-500">Hạn mức tự duyệt:</span>
          <span className="text-xs font-semibold">{threshold >= 999999999999 ? "Không giới hạn (Toàn quyền)" : `${threshold.toLocaleString()} VNĐ`}</span>
        </Div>
        
        {isReviewMode && isOverThreshold && (
          <div className="mt-3 flex items-start gap-2 bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm">
            <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
            <p><strong>Cảnh báo:</strong> Tổng giá trị chênh lệch vượt quá hạn mức cho phép. Bạn không thể tự duyệt phiếu này, hãy yêu cầu Chủ thương hiệu duyệt.</p>
          </div>
        )}
      </Div>

      {isReviewMode && (
        <InputBox
          label="Lý do duyệt / Từ chối (Bắt buộc nếu Từ chối)"
          placeholder="Nhập lý do..."
          value={reason}
          onChange={(e: any) => setReason(e.target.value)}
        />
      )}

      <Div vitri="row_end" className="w-full gap-3 mt-4 pt-4 border-t border-gray-200">
        <Button variant="gray_hover" sizea="p4_2" onClick={onClose} disabled={isPending}>Đóng</Button>
        {isReviewMode && (
          <>
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
            <Button variant="green" sizea="p4_2" className="gap-2" onClick={() => onApprove(reason)} disabled={isPending || isOverThreshold}>
              <FaCheck /> Phê duyệt
            </Button>
          </>
        )}
      </Div>
    </Div>
  )
}
