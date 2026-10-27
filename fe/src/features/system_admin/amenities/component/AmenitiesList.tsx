"use client";

import React, { useState } from "react";
import { 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiRefreshCw, 
  FiLayers, 
  FiHome, 
  FiSmile, 
  FiCopy, 
  FiChevronLeft, 
  FiChevronRight, 
  FiX, 
  FiInfo,
  FiCheckCircle,
  FiCheck
} from "react-icons/fi";
import FadeIn from "@/src/core/components/animation/FadeIn";
import useDebounce from "@/src/core/hooks/useDebounce";
import { useAmenities, useDeleteAmenity } from "../hook/useAmenity_hook";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import CreateAmenityForm from "./CreateAmenityForm";
import UpdateAmenityForm from "./UpdateAmenityForm";
import { getAmenityIcon } from "../constants/amenity_icons";
import { toast } from "sonner";

const AmenitiesList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce({ value: searchTerm, delay: 400 });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const { data: listData, isLoading, refetch, isRefetching } = useAmenities({
    page,
    limit,
    search: debouncedSearch || undefined
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteAmenity();

  const items = listData?.data || [];
  const total = listData?.total ?? items.length;
  const totalPages = Math.ceil(total / limit) || 1;

  const handleCopyIcon = (iconName: string) => {
    navigator.clipboard.writeText(iconName);
    setCopiedIcon(iconName);
    toast.success(`Đã sao chép mã icon "${iconName}"`);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Mặc định";
    try {
      const d = new Date(dateStr);
      return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${d.getFullYear()}`;
    } catch {
      return "Mặc định";
    }
  };

  return (
    <FadeIn className="w-full space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1.5">
            <span>Hệ thống</span>
            <span>/</span>
            <span>Danh mục chuẩn</span>
            <span>/</span>
            <span className="text-gray-400">Tiện ích</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Quản lý Tiện ích</h1>
            <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full">
              {total} tiện ích chuẩn
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Thiết lập các tiện ích chuẩn (Wifi, Chỗ để ô tô, Máy lạnh, Phòng VIP, Khu vui chơi trẻ em...) để các nhà hàng lựa chọn hiển thị trên ứng dụng.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center justify-center w-11 h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-sm transition-all hover:rotate-180 duration-300 disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <FiRefreshCw className={`text-base ${isRefetching ? "animate-spin text-indigo-600" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <FiPlus className="text-lg" />
            <span>Thêm tiện ích mới</span>
          </button>
        </div>
      </div>

      {/* 2. Stats / KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tổng số tiện ích</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{total}</h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-medium">100% khả dụng</span> cho tất cả chi nhánh
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-200">
              <FiLayers />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-300" />
        </div>

        {/* Card 2 */}
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cơ sở vật chất</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">Chuẩn nhà hàng</h3>
              <p className="text-xs text-gray-500 mt-1">Wifi, Máy lạnh, Chỗ đỗ xe, VIP</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center text-xl shadow-md shadow-teal-200">
              <FiHome />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-teal-300" />
        </div>

        {/* Card 3 */}
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Trải nghiệm & Dịch vụ</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">Tối ưu khách hàng</h3>
              <p className="text-xs text-gray-500 mt-1">Khu trẻ em, Thẻ ngân hàng, Âm nhạc</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center text-xl shadow-md shadow-amber-200">
              <FiSmile />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300" />
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên tiện ích, mô tả..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-md"
            >
              <FiX className="text-sm" />
            </button>
          )}
        </div>

        {debouncedSearch && (
          <div className="flex items-center gap-2 text-xs text-gray-500 self-start sm:self-center">
            <span>Kết quả tìm kiếm cho:</span>
            <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
              "{debouncedSearch}"
            </span>
          </div>
        )}
      </div>

      {/* 4. Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Tiện ích & Biểu tượng</th>
                <th className="py-4 px-6">Mã Biểu tượng</th>
                <th className="py-4 px-6">Mô tả chi tiết</th>
                <th className="py-4 px-6">Ngày khởi tạo</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FiRefreshCw className="animate-spin text-2xl text-indigo-600" />
                      <span className="text-sm">Đang tải danh sách tiện ích...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center text-2xl">
                        <FiInfo />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Không tìm thấy tiện ích nào</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {debouncedSearch
                            ? "Không có tiện ích nào khớp với từ khóa tìm kiếm của bạn."
                            : "Hệ thống chưa có tiện ích nào được khởi tạo."}
                        </p>
                      </div>
                      {debouncedSearch ? (
                        <button
                          type="button"
                          onClick={() => setSearchTerm("")}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all"
                        >
                          Xóa tìm kiếm
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsCreateOpen(true)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                        >
                          + Thêm tiện ích đầu tiên
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item: any) => {
                  const isCopied = copiedIcon === item.icon;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Cột 1: Tiện ích & Biểu tượng */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xl shrink-0 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            {getAmenityIcon(item.icon)}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block group-hover:text-indigo-600 transition-colors">
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              {item.slug || `amenity-${item.id.slice(-6)}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Mã Icon */}
                      <td className="py-4 px-6">
                        {item.icon ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-mono text-slate-700">
                            <span>{item.icon}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyIcon(item.icon)}
                              className="text-gray-400 hover:text-indigo-600 transition-colors p-0.5"
                              title="Sao chép tên icon"
                            >
                              {isCopied ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Mặc định</span>
                        )}
                      </td>

                      {/* Cột 3: Mô tả */}
                      <td className="py-4 px-6 max-w-xs">
                        {item.description ? (
                          <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Chưa có mô tả</span>
                        )}
                      </td>

                      {/* Cột 4: Ngày tạo */}
                      <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Cột 5: Thao tác */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(item);
                              setIsUpdateOpen(true);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all"
                            title="Chỉnh sửa tiện ích"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelected(item);
                              setIsDeleteOpen(true);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                            title="Xóa tiện ích"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Bar */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="text-xs text-gray-500">
            Hiển thị{" "}
            <span className="font-semibold text-gray-800">
              {items.length === 0 ? 0 : (page - 1) * limit + 1}
            </span>{" "}
            đến{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(page * limit, total)}
            </span>{" "}
            của <span className="font-semibold text-gray-800">{total}</span> tiện ích
          </div>

          <div className="flex items-center gap-3">
            {/* Rows per page selector */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span>Hiển thị:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 cursor-pointer"
              >
                <option value={10}>10 dòng</option>
                <option value={20}>20 dòng</option>
                <option value={50}>50 dòng</option>
              </select>
            </div>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Trang trước"
              >
                <FiChevronLeft className="text-sm" />
              </button>

              <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Trang sau"
              >
                <FiChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Modals */}
      {isCreateOpen && (
        <CreateAmenityForm isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      )}

      {isUpdateOpen && (
        <UpdateAmenityForm
          isOpen={isUpdateOpen}
          onClose={() => {
            setIsUpdateOpen(false);
            setSelected(null);
          }}
          initialData={selected}
        />
      )}

      {isDeleteOpen && selected && (
        <ConfirmModal
          open={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelected(null);
          }}
          onConfirm={() => {
            deleteMutation(selected.id);
            setIsDeleteOpen(false);
            setSelected(null);
          }}
          type="danger"
          isLoading={isDeleting}
          title="Xác nhận xóa tiện ích"
          content={
            <div className="space-y-2">
              <p>
                Bạn có chắc chắn muốn xóa tiện ích{" "}
                <span className="font-bold text-gray-900">"{selected?.name}"</span> khỏi hệ thống?
              </p>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-700">
                Lưu ý: Các nhà hàng và chi nhánh đang liên kết với tiện ích này sẽ không còn hiển thị tiện ích này nữa. Hành động này không thể hoàn tác.
              </div>
            </div>
          }
          confirmText="Xác nhận xóa"
          cancelText="Hủy bỏ"
        />
      )}
    </FadeIn>
  );
};

export default AmenitiesList;
