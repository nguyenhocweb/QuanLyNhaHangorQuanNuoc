import React, { useState } from 'react';
import { Div, Button } from '@/src/core/components/ui';
import { FaStackOverflow, FaPlus, FaTimes, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { useGetManagerStocks, useGetManagerMasterItems } from '../hooks/useManagerInventoryStock';
import { useCreatePurchaseRequest } from '../hooks/useCreatePurchaseRequest';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import useDebounce from '@/src/core/hooks/useDebounce';
import { PurchaseRequestForm } from './PurchaseRequestForm';

export const ManagerInventoryStocksTab = () => {
  const { user, activeWorkspace } = useAuthStore();
  const role = user?.role || "Quản lý nhà hàng";
  const restaurantId = activeWorkspace?.id || "";
  const brandId = activeWorkspace?.brandId || ""; // Need brandId to fetch master items

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce({ value: searchTerm, delay: 500 });
  
  const [isRequestingStock, setIsRequestingStock] = useState(false);

  const { data: stocksData, isLoading } = useGetManagerStocks(restaurantId, role, debouncedSearch, currentPage, itemsPerPage);
  const stocks = Array.isArray(stocksData?.metadata?.stocks) ? stocksData.metadata.stocks : [];
  const totalCount = stocksData?.metadata?.options?.totalCount || 0;
  const totalPages = stocksData?.metadata?.options?.totalPages || 1;

  // Fetch all items from brand to select from
  const { data: allItemsData } = useGetManagerMasterItems(restaurantId, role);
  const allItems = Array.isArray(allItemsData?.metadata?.items) ? allItemsData.metadata.items : [];
  
  // Lọc bỏ những item đã có trong stock
  const existingItemIds = stocks.map((s: any) => s.inventoryItemId);
  const availableItems = allItems.filter((item: any) => !existingItemIds.includes(item.id));

  const { mutate: createPurchaseRequest, isPending: isCreatingRequest } = useCreatePurchaseRequest();

  const handleAdd = (formData: any) => {
    createPurchaseRequest(formData, {
      onSuccess: () => {
        setIsRequestingStock(false);
      }
    });
  };

  return (
    <Div vitri="col_none" className="w-full h-full gap-4">
      {/* Filters and Add Button */}
      <Div className="w-full flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm mặt hàng..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="green" sizea="p4_2" className="gap-2" onClick={() => setIsRequestingStock(true)}>
          <FaPlus /> Yêu cầu nhập kho
        </Button>
      </Div>

      {/* Table */}
      <Div vitri="col_none" className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex-1">
        <div className="w-full overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                <th className="p-4 font-semibold text-gray-700 w-16 text-center">STT</th>
                <th className="p-4 font-semibold text-gray-700">Tên mặt hàng</th>
                <th className="p-4 font-semibold text-gray-700">Đơn vị tính</th>
                {role === "Quản lý nhà hàng" && (
                  <th className="p-4 font-semibold text-gray-700 text-right">Tồn kho hiện tại</th>
                )}
                <th className="p-4 font-semibold text-gray-700">Mức tối thiểu</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : stocks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Chưa có mặt hàng nào. Vui lòng thêm mặt hàng để theo dõi tồn kho.
                  </td>
                </tr>
              ) : (
                stocks.map((stock: any, index: number) => {
                  const minLevel = stock.inventoryItem?.minStockLevel || 0;
                  const isLowStock = role === "Quản lý nhà hàng" && stock.quantity <= minLevel;
                  
                  return (
                  <tr key={stock.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm ${isLowStock ? 'bg-red-50/30' : ''}`}>
                    <td className="p-4 text-gray-600 text-center font-medium">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {stock.inventoryItem?.name}
                    </td>
                    <td className="p-4 text-gray-600">
                      {stock.inventoryItem?.baseUnit}
                    </td>
                    {role === "Quản lý nhà hàng" && (
                      <td className="p-4 text-right font-bold text-lg">
                        <span className={isLowStock ? "text-red-600 flex items-center justify-end gap-2" : "text-blue-600"}>
                          {stock.quantity}
                          {isLowStock && <FaExclamationTriangle size={14} title="Sắp hết hàng" />}
                        </span>
                      </td>
                    )}
                    <td className="p-4 text-gray-600 font-medium">
                      {minLevel}
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {stocks.length > 0 && (
          <div className="w-full flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 mt-4 rounded-xl">
            <span className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, totalCount)} của {totalCount} kết quả
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                Hiển thị:
                <select 
                  className="border border-gray-300 rounded-md px-2 py-1 outline-none focus:border-blue-500 bg-white"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-all bg-white"
                >
                  Trước
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-all bg-white"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </Div>

      {/* Modal Purchase Request */}
      {isRequestingStock && (
        <Div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Div vitri="col_none" className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl relative gap-4 max-h-[90vh] overflow-hidden flex flex-col">
            <button onClick={() => setIsRequestingStock(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3 w-full shrink-0">Yêu cầu nhập kho</h2>
            
            <div className="w-full bg-blue-50 text-blue-800 p-3 rounded-lg text-sm shrink-0">
              Điền các mặt hàng cần xin cấp từ Tổng bộ. Kế toán sẽ duyệt và phản hồi.
            </div>

            <div className="flex-1 overflow-y-auto w-full">
              <PurchaseRequestForm 
                restaurantId={restaurantId}
                availableItems={allItems}
                stocks={stocks}
                onSubmit={handleAdd}
                onClose={() => setIsRequestingStock(false)}
                isPending={isCreatingRequest}
              />
            </div>
          </Div>
        </Div>
      )}
    </Div>
  );
};
