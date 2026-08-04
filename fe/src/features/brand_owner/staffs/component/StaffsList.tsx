"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { useGetStaffs } from "../hook/useGetStaffs";
import { usePagination } from "@/src/core/hooks/usePagination";
import useDebounce from "@/src/core/hooks/useDebounce";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Input, Button, Table } from "@/src/core/components/ui";
import Pagination from "@/src/core/components/layout/Pagination";
import { FaPlus, FaSearch, FaUserShield, FaTrash, FaEdit } from "react-icons/fa";
import CreateStaffForm from "./CreateStaffForm";
import UpdateStaffForm from "./UpdateStaffForm";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { useDeleteStaff } from "../hook/useDeleteStaff";

export default function StaffsList() {
  const params = useParams();
  const user = useAuthStore(state => state.user);
  const brandId = user?.brand?.find((b: any) => b?.isSelect || b?.isSlect)?.id || user?.brand?.find((b: any) => b?.id)?.id || "";

  const { currentPage, limit, searchKeyword, setPage, setLimit, setSearch } = usePagination();
  const [localSearch, setLocalSearch] = useState(searchKeyword || "");
  const debouncedSearch = useDebounce({ value: localSearch, delay: 500 });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [staffToDelete, setStaffToDelete] = useState<any>(null);

  const { mutateAsync: deleteStaff, isPending: isDeleting } = useDeleteStaff(brandId);

  const handleDelete = async () => {
    if (!staffToDelete) return;
    try {
      await deleteStaff(staffToDelete.id);
      setStaffToDelete(null);
    } catch (error) {}
  };

  useEffect(() => {
    if (debouncedSearch !== searchKeyword) {
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, searchKeyword, setSearch]);

  const { data, isLoading, isError } = useGetStaffs({
    brandId,
    page: currentPage,
    limit,
    search: searchKeyword || undefined,
  });

  return (
    <FadeIn>
      <div className="w-full flex flex-col gap-6 p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản Lý Nhân Viên</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản, chức vụ và quyền hạn của nhân viên.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm theo tên, email, sđt, ID..."
                className="pl-10 w-full"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateOpen(true)} variant="green" className="flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <FaPlus /> Thêm mới
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-gray-500">Đang tải danh sách nhân viên...</div>
          ) : isError ? (
            <div className="flex justify-center items-center py-20 text-red-500">Có lỗi xảy ra khi lấy danh sách nhân viên.</div>
          ) : !data || data.items.length === 0 ? (
            <div className="flex justify-center items-center py-20 text-gray-500">Không tìm thấy nhân viên nào.</div>
          ) : (
            <>
              <div className="overflow-x-auto w-full">
                <Table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 px-4 text-sm font-semibold text-gray-600">Nhân viên</th>
                      <th className="py-4 px-4 text-sm font-semibold text-gray-600">Thông tin liên hệ</th>
                      <th className="py-4 px-4 text-sm font-semibold text-gray-600">Nơi làm việc</th>
                      <th className="py-4 px-4 text-sm font-semibold text-gray-600">Vai trò</th>
                      <th className="py-4 px-4 text-sm font-semibold text-gray-600">Quyền hạn</th>
                      <th className="py-4 px-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((staff) => (
                      <tr key={staff.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {staff.avatar ? (
                              <img src={staff.avatar} alt={staff.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                {(staff.name || "U").charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-800">{staff.name || "Chưa cập nhật tên"}</p>
                              <p className="text-xs text-gray-500">ID: {staff.userId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-700">{staff.email}</p>
                          <p className="text-sm text-gray-500">{staff.sdt || "Chưa cập nhật SĐT"}</p>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {staff.restaurantName || "Toàn chi nhánh"}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            staff.roleName === 'Quản lý nhà hàng'
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {staff.roleName === 'Quản lý nhà hàng' ? 'Quản lý nhà hàng' : 'Nhân viên'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <FaUserShield className="text-indigo-500" />
                            <span className="text-sm text-gray-700 font-medium">{staff.permissions.length} quyền</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="gray" 
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                              onClick={() => {
                                setSelectedStaff(staff);
                                setIsUpdateOpen(true);
                              }}
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="gray" 
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                              onClick={() => setStaffToDelete(staff)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination UI */}
              <div className="flex flex-col md:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-100 gap-4 w-full">
                <span className="text-sm text-gray-500">
                  Hiển thị {((currentPage - 1) * limit) + 1} đến {Math.min(currentPage * limit, data.meta.total)} của {data.meta.total} kết quả
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Số lượng:</span>
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-indigo-500 bg-transparent"
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1); // Reset to page 1 on limit change
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={data.meta.totalPages}
                    limit={limit}
                    onPageChange={(page) => setPage(page)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <CreateStaffForm 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        id_brand={brandId} 
      />

      <UpdateStaffForm
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedStaff(null);
        }}
        id_brand={brandId}
        staffData={selectedStaff}
      />

      <ConfirmModal
        open={!!staffToDelete}
        title="Xác nhận xóa nhân viên"
        content={`Bạn có chắc chắn muốn xóa nhân viên ${staffToDelete?.name} khỏi hệ thống không? Tất cả quyền hạn của nhân viên này sẽ bị thu hồi.`}
        type="danger"
        isLoading={isDeleting}
        confirmText="Xóa nhân viên"
        cancelText="Hủy bỏ"
        onClose={() => setStaffToDelete(null)}
        onConfirm={handleDelete}
      />
    </FadeIn>
  );
}
