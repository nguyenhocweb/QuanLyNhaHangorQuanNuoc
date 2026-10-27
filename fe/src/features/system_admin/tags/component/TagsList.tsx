"use client";

import React, { useState } from "react";
import { 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiRefreshCw, 
  FiTag, 
  FiSmile, 
  FiHeart, 
  FiCopy, 
  FiChevronLeft, 
  FiChevronRight, 
  FiX, 
  FiInfo,
  FiCheck
} from "react-icons/fi";
import FadeIn from "@/src/core/components/animation/FadeIn";
import useDebounce from "@/src/core/hooks/useDebounce";
import { useTags, useDeleteTag } from "../hook/useTag_hook";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import CreateTagForm from "./CreateTagForm";
import UpdateTagForm from "./UpdateTagForm";
import { toast } from "sonner";

const TagsList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce({ value: searchTerm, delay: 400 });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const { data: listData, isLoading, refetch, isRefetching } = useTags({
    page,
    limit,
    search: debouncedSearch || undefined
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteTag();

  const items = listData?.data || [];
  const total = listData?.total ?? items.length;
  const totalPages = Math.ceil(total / limit) || 1;

  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    setCopiedSlug(slug);
    toast.success(`Đã sao chép slug "${slug}"`);
    setTimeout(() => setCopiedSlug(null), 2000);
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
            <span className="text-gray-400">Thẻ (Tags)</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Quản lý Thẻ (Tags)</h1>
            <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full">
              {total} thẻ phân loại
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Tạo các thẻ phân loại đặc trưng (Sang trọng, Bình dân, View đẹp, Hẹn hò, Trẻ trung...) giúp tối ưu công cụ tìm kiếm và lọc nhà hàng cho thực khách.
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
            <span>Thêm thẻ mới</span>
          </button>
        </div>
      </div>

      {/* 2. Stats / KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tổng thẻ phân loại</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{total}</h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-medium">Khả dụng</span> trong bộ lọc toàn hệ thống
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-200">
              <FiTag />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-300" />
        </div>

        {/* Card 2 */}
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Phong cách & Không gian</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">Đa dạng trải nghiệm</h3>
              <p className="text-xs text-gray-500 mt-1">View đẹp, Trẻ trung, Sang trọng</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center text-xl shadow-md shadow-teal-200">
              <FiSmile />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-teal-300" />
        </div>

        {/* Card 3 */}
        <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Dịp gặp gỡ & Hẹn hò</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">Gợi ý thông minh</h3>
              <p className="text-xs text-gray-500 mt-1">Hẹn hò lãng mạn, Họp mặt gia đình</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 text-white flex items-center justify-center text-xl shadow-md shadow-rose-200">
              <FiHeart />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-rose-300" />
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          <input
            type="text"
            placeholder="Tìm kiếm thẻ theo tên, slug, mô tả..."
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
                <th className="py-4 px-6">Thẻ hiển thị (Tag)</th>
                <th className="py-4 px-6">Đường dẫn tĩnh (Slug)</th>
                <th className="py-4 px-6">Mã màu</th>
                <th className="py-4 px-6">Mô tả</th>
                <th className="py-4 px-6">Ngày khởi tạo</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FiRefreshCw className="animate-spin text-2xl text-indigo-600" />
                      <span className="text-sm">Đang tải danh sách thẻ...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center text-2xl">
                        <FiInfo />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Không tìm thấy thẻ phân loại nào</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {debouncedSearch
                            ? "Không có thẻ nào khớp với từ khóa tìm kiếm của bạn."
                            : "Hệ thống chưa có thẻ phân loại nào được tạo."}
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
                          + Thêm thẻ đầu tiên
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item: any) => {
                  const isCopied = copiedSlug === item.slug;
                  const itemBg = item.bgColor || "#F3F4F6";
                  const itemText = item.textColor || "#374151";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Cột 1: Thẻ hiển thị */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 shadow-xs border transition-transform group-hover:scale-105"
                            style={{
                              backgroundColor: itemBg,
                              color: itemText,
                              borderColor: `${itemText}33`
                            }}
                          >
                            <FiTag />
                          </div>
                          <div>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs border whitespace-nowrap"
                              style={{
                                backgroundColor: itemBg,
                                color: itemText,
                                borderColor: `${itemText}40`
                              }}
                            >
                              <span>{item.name}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Slug */}
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-mono text-slate-700">
                          <span>{item.slug || `tag-${item.id.slice(-6)}`}</span>
                          <button
                            type="button"
                            onClick={() => handleCopySlug(item.slug || item.id)}
                            className="text-gray-400 hover:text-indigo-600 transition-colors p-0.5"
                            title="Sao chép slug"
                          >
                            {isCopied ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                          </button>
                        </div>
                      </td>

                      {/* Cột 3: Mã màu */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-xs inline-block"
                              style={{ backgroundColor: itemBg }}
                              title={`Màu nền: ${itemBg}`}
                            />
                            <span className="text-[11px] font-mono text-gray-500 uppercase">{itemBg}</span>
                          </div>
                          <span className="text-gray-300">/</span>
                          <div className="flex items-center gap-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-xs inline-block"
                              style={{ backgroundColor: itemText }}
                              title={`Màu chữ: ${itemText}`}
                            />
                            <span className="text-[11px] font-mono text-gray-500 uppercase">{itemText}</span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 4: Mô tả */}
                      <td className="py-4 px-6 max-w-xs">
                        {item.description && item.description !== "m" ? (
                          <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Không có mô tả</span>
                        )}
                      </td>

                      {/* Cột 5: Ngày tạo */}
                      <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Cột 6: Thao tác */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(item);
                              setIsUpdateOpen(true);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all"
                            title="Chỉnh sửa thẻ"
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
                            title="Xóa thẻ"
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
            của <span className="font-semibold text-gray-800">{total}</span> thẻ phân loại
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
        <CreateTagForm isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      )}

      {isUpdateOpen && (
        <UpdateTagForm
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
          title="Xác nhận xóa thẻ phân loại"
          content={
            <div className="space-y-2">
              <p>
                Bạn có chắc chắn muốn xóa thẻ{" "}
                <span className="font-bold text-gray-900">"{selected?.name}"</span> khỏi hệ thống?
              </p>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-700">
                Lưu ý: Các nhà hàng hoặc món ăn đang gắn thẻ này sẽ không còn hiển thị nhãn này trong kết quả tìm kiếm. Hành động này không thể hoàn tác.
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

export default TagsList;
