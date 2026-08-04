import React, { useState } from "react";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Button } from "@/src/core/components/ui/Button";
import { FaEdit, FaTrash, FaEye, FaUserTie, FaUser, FaMoneyBillWave } from "react-icons/fa";
import { IStaff } from "../type/staff.type";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { useDeleteStaff } from "../hook/useDeleteStaff";

interface StaffsListProps {
  staffs: IStaff[];
  isLoading: boolean;
  onEdit: (staff: IStaff) => void;
  onView: (staff: IStaff) => void;
  restaurantId: string;
  isManagerView: boolean;
  hasCreateStaffPerm: boolean | undefined;
}

export default function StaffsList({ staffs, isLoading, onEdit, onView, restaurantId, isManagerView, hasCreateStaffPerm }: StaffsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { mutate: deleteStaff, isPending: isDeleting } = useDeleteStaff();

  const handleDelete = () => {
    if (!deletingId) return;
    deleteStaff(
      { id: deletingId, restaurantId },
      {
        onSuccess: () => setDeletingId(null),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 w-full bg-slate-100 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (staffs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <FaUser className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-700">Chưa có nhân sự</h3>
        <p className="text-slate-500 mt-1">Chi nhánh này hiện chưa có nhân sự nào được phân công.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {staffs.map((staff, idx) => (
          <FadeIn key={staff.id} delay={idx * 0.05} className="w-full">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                  {staff.roleName === "Quản lý nhà hàng" ? (
                    <FaUserTie className="w-5 h-5 text-blue-600" />
                  ) : (
                    <FaUser className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate text-lg">{staff.name}</h4>
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium mt-1 ${
                    staff.roleName === "Quản lý nhà hàng" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {staff.roleName}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-6 flex-1 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-medium min-w-[60px]">SĐT:</span>
                  <span className="truncate">{staff.sdt || "---"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-medium min-w-[60px]">Email:</span>
                  <span className="truncate">{staff.email || "---"}</span>
                </div>
                {isManagerView && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="font-medium min-w-[60px]">Lương:</span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-50 text-green-700 font-medium">
                      <FaMoneyBillWave className="w-3 h-3" />
                      {staff.salary_type === "HOURLY" ? "Theo giờ" : staff.salary_type === "MONTHLY" ? "Cố định" : "Chưa thiết lập"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-50 mt-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="outline"
                  sizea="p3_1"
                  onClick={() => onView(staff)}
                  className="flex-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border-0 h-9"
                >
                  <FaEye className="mr-1.5" /> Chi tiết
                </Button>
                {isManagerView && (
                  <Button
                    variant="outline"
                    sizea="p3_1"
                    onClick={() => onEdit(staff)}
                    className="flex-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border-0 h-9"
                  >
                    <FaEdit className="mr-1.5" /> Sửa
                  </Button>
                )}
                {(isManagerView || hasCreateStaffPerm) && (
                  <Button
                    variant="outline"
                    sizea="p3_1"
                    onClick={() => setDeletingId(staff.id)}
                    className="flex-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border-0 h-9"
                  >
                    <FaTrash className="mr-1.5" /> Rút
                  </Button>
                )}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {(isManagerView || hasCreateStaffPerm) && (
        <ConfirmModal
          open={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
          title="Xác nhận rút biên chế"
          content="Bạn có chắc chắn muốn rút nhân viên này khỏi chi nhánh? Tài khoản của họ vẫn sẽ tồn tại trong hệ thống thương hiệu nhưng sẽ không còn thuộc quyền quản lý của chi nhánh này."
          confirmText={isDeleting ? "Đang xử lý..." : "Xác nhận rút"}
          cancelText="Hủy bỏ"
        />
      )}
    </>
  );
}
