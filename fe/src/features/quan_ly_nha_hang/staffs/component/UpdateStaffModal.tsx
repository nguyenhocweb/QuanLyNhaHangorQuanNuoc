import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/src/core/components/layout/public-Modal";
import { Button } from "@/src/core/components/ui/Button";
import { Label } from "@/src/core/components/ui/Label";
import { useUpdateStaff } from "../hook/useUpdateStaff";
import { updateStaffSchema, UpdateStaffValues } from "../schema/staff.schema";
import { IStaff } from "../type/staff.type";
import { useGetPermissions } from "../hook/useGetPermissions";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { Div } from "@/src/core/components/ui";

interface UpdateStaffModalProps {
  staff: IStaff | null;
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
}
export default function UpdateStaffModal({ staff, isOpen, onClose, brandId }: UpdateStaffModalProps) {
  const { activeWorkspace, user } = useAuthStore();
  const isManagerView = user?.role === "Quản lý nhà hàng";
  const { data: permissionsDict } = useGetPermissions(brandId);
  
  const form = useForm<UpdateStaffValues>({
    resolver: zodResolver(updateStaffSchema) as any,
    defaultValues: {
      roleName: "Nhân viên",
      salary_type: null,
      permissionIds: [],
    },
  });

  useEffect(() => {
    if (staff && isOpen) {
      form.reset({
        roleName: staff.roleName,
        salary_type: staff.salary_type,
        permissionIds: staff.permissions?.map((p) => p.id) || [],
      });
    }
  }, [staff, isOpen, form]);

  const { mutate, isPending } = useUpdateStaff();

  const onSubmit = (data: UpdateStaffValues) => {
    if (!staff) return;
    mutate(
      { id: staff.id, payload: { ...data, restaurantId: staff.restaurantId || activeWorkspace?.id } },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!staff) return null;

  return (
    <Modal open={isOpen} onClose={onClose} title="Cập Nhật Thông Tin Nhân Sự">
      <div className="mb-4 text-sm text-slate-500">
        Thay đổi vị trí hoặc hình thức lương cho nhân viên <span className="font-semibold text-slate-800">{staff.name}</span>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Div vitri="col_none" className="space-y-4 w-full">
          <div className="space-y-1.5 w-full">
            <Label className="font-medium text-slate-700">Hình thức nhận lương</Label>
            <select
              className="w-full h-11 rounded-xl bg-slate-50 border border-slate-200 px-3 outline-none focus:border-blue-500"
              {...form.register("salary_type")}
            >
              <option value="">Chọn hình thức lương</option>
              <option value="HOURLY">Lương theo giờ</option>
              <option value="MONTHLY">Lương cố định (tháng)</option>
            </select>
          </div>

          <div className="space-y-1.5 w-full">
            <Label className="font-medium text-slate-700">Vị trí (Vai trò)</Label>
            <select
              className="w-full h-11 rounded-xl bg-slate-50 border border-slate-200 px-3 outline-none focus:border-blue-500"
              {...form.register("roleName")}
            >
              <option value="Nhân viên">Nhân viên</option>
              <option value="Quản lý nhà hàng">Quản lý nhà hàng</option>
            </select>
          </div>
          
          {isManagerView && permissionsDict && permissionsDict["RESTAURANT"] && (
            <div className="space-y-2 mt-2 w-full">
              <Label className="font-medium text-slate-700">Phân quyền chi tiết (chỉ dành cho Quản lý)</Label>
              <div className="grid grid-cols-2 gap-3 max-h-[180px] overflow-y-auto pr-1">
                {permissionsDict["RESTAURANT"].map((perm: any) => (
                  <label key={perm.id} className="flex items-start gap-2 cursor-pointer p-2 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                    <input
                      type="checkbox"
                      value={perm.id}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      {...form.register("permissionIds")}
                    />
                    <span className="text-sm text-slate-700 leading-tight">
                      {perm.description || perm.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </Div>

        <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-2">
          <Button type="button" variant="gray_hover" sizea="p4_2" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            type="submit" 
            variant="blue" 
            sizea="p4_2"
            disabled={isPending}
          >
            {isPending ? "Đang xử lý..." : "Lưu Thay Đổi"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
