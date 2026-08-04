"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaUsers, FaPlus, FaSearch } from "react-icons/fa";
import { Button } from "@/src/core/components/ui/Button";
import { Input } from "@/src/core/components/ui/Input";
import useDebounce from "@/src/core/hooks/useDebounce";
import { useGetStaffs } from "@/src/features/quan_ly_nha_hang/staffs/hook/useGetStaffs";
import StaffStatsHeader from "@/src/features/quan_ly_nha_hang/staffs/component/StaffStatsHeader";
import StaffsList from "@/src/features/quan_ly_nha_hang/staffs/component/StaffsList";
import CreateStaffModal from "@/src/features/quan_ly_nha_hang/staffs/component/CreateStaffModal";
import UpdateStaffModal from "@/src/features/quan_ly_nha_hang/staffs/component/UpdateStaffModal";
import StaffDetailModal from "@/src/features/quan_ly_nha_hang/staffs/component/StaffDetailModal";
import { IStaff } from "@/src/features/quan_ly_nha_hang/staffs/type/staff.type";
import { usePagination } from "@/src/core/hooks/usePagination";

export default function RestaurantStaffsPage() {
  const { activeWorkspace, user } = useAuthStore();
  const restaurantId = activeWorkspace?.id || "";
  const isManagerView = user?.role === "Quản lý nhà hàng";
  const hasCreateStaffPerm = user?.permissions?.includes("CREATE_STAFF");
  
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce({ value: searchTerm, delay: 500 });
  const [salaryTypeFilter, setSalaryTypeFilter] = useState<string>("ALL");

  const { currentPage: page, limit, setPage, setLimit } = usePagination();

  const { data, isLoading } = useGetStaffs({
    restaurantId,
    page,
    limit,
    search: debouncedSearch,
    salary_type: salaryTypeFilter,
  });

  const staffs = data?.metadata?.items || [];
  const meta = data?.metadata?.meta;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<IStaff | null>(null);
  const [viewingStaff, setViewingStaff] = useState<IStaff | null>(null);

  return (
    <FadeIn className="w-full flex flex-col gap-6 p-6 md:p-8">
      {/* Header Block */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FaUsers className="text-2xl" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800">
              {isManagerView ? "Quản lý nhân sự" : "Danh bạ đồng nghiệp"}
            </h1>
            <p className="text-sm text-slate-500">
              {isManagerView
                ? "Quản lý thông tin, vai trò và phân công công việc tại chi nhánh."
                : "Xem thông tin liên hệ của các đồng nghiệp trong cùng chi nhánh."}
            </p>
          </div>
        </div>

        {(isManagerView || hasCreateStaffPerm) && (
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 shadow-sm transition-all duration-200"
          >
            <FaPlus /> Thêm Nhân Sự
          </Button>
        )}
      </div>

      {!restaurantId ? (
        <div className="w-full bg-amber-50 text-amber-800 p-6 rounded-2xl border border-amber-200 text-center">
          <p className="font-semibold">Vui lòng chọn một chi nhánh làm việc từ thanh điều hướng.</p>
        </div>
      ) : (
        <>
          {/* KPI Cards (Only for Managers) */}
          {isManagerView && <StaffStatsHeader staffs={staffs} isLoading={isLoading} />}

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative w-full md:w-[350px]">
              <Input
                placeholder="Tìm kiếm theo tên, SĐT, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 w-full focus:border-blue-500 transition-colors"
              />
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="flex gap-4">
              {isManagerView && (
                <select
                  value={salaryTypeFilter}
                  onChange={(e) => setSalaryTypeFilter(e.target.value)}
                  className="w-[180px] h-11 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 transition-colors px-3 outline-none"
                >
                  <option value="ALL">Tất cả hình thức</option>
                  <option value="HOURLY">Lương theo giờ</option>
                  <option value="MONTHLY">Lương cố định</option>
                </select>
              )}
            </div>
          </div>

          <div className="w-full">
            <StaffsList
              staffs={staffs}
              isLoading={isLoading}
              onEdit={setEditingStaff}
              onView={setViewingStaff}
              restaurantId={restaurantId}
              isManagerView={isManagerView}
              hasCreateStaffPerm={hasCreateStaffPerm}
            />
          </div>

          {/* Pagination UI */}
          {meta && meta.totalPages > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-4 mt-2">
              <div className="text-sm text-slate-600">
                Hiển thị <span className="font-semibold text-slate-800">{Math.min((page - 1) * limit + 1, meta.total)}</span> đến <span className="font-semibold text-slate-800">{Math.min(page * limit, meta.total)}</span> của <span className="font-semibold text-slate-800">{meta.total}</span> kết quả
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Số dòng:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Trước
                  </button>
                  <div className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200 shadow-sm">
                    Trang {page} / {meta.totalPages || 1}
                  </div>
                  <button
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modals */}
          {(isManagerView || hasCreateStaffPerm) && (
            <CreateStaffModal
              restaurantId={restaurantId}
              brandId={restaurantId}
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
            />
          )}

          {isManagerView && (
            <UpdateStaffModal
              staff={editingStaff}
              isOpen={!!editingStaff}
              onClose={() => setEditingStaff(null)}
              brandId={activeWorkspace?.id || ""}
            />
          )}
          
          <StaffDetailModal
            staff={viewingStaff}
            isOpen={!!viewingStaff}
            onClose={() => setViewingStaff(null)}
          />
        </>
      )}
    </FadeIn>
  );
}
