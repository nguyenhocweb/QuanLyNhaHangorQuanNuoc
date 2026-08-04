import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/src/core/components/layout/public-Modal";
import { Button } from "@/src/core/components/ui/Button";
import { Input } from "@/src/core/components/ui/Input";
import { Label } from "@/src/core/components/ui/Label";
import { useCreateStaff } from "../hook/useCreateStaff";
import { createStaffSchema, CreateStaffValues } from "../schema/staff.schema";
import { FaEnvelope } from "react-icons/fa";
import useDebounce from "@/src/core/hooks/useDebounce";
import axiosClient from "@/src/core/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Div } from "@/src/core/components/ui";
import { useGetPermissions } from "../hook/useGetPermissions";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

interface CreateStaffModalProps {
  restaurantId: string;
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
}

export default function CreateStaffModal({ restaurantId, isOpen, onClose, brandId }: CreateStaffModalProps) {
  const [activeTab, setActiveTab] = useState<"new" | "existing">("new");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce({ value: searchTerm, delay: 500 });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { activeWorkspace, user } = useAuthStore();
  const isManagerView = user?.role === "Quản lý nhà hàng";
  const { data: permissionsDict } = useGetPermissions(brandId);
  
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["user_search", brandId, debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const res = await axiosClient.get(`/brand-owner/${brandId}/user/search`, {
        params: { keyword: debouncedSearch },
      });
      return res.data.metadata;
    },
    enabled: !!debouncedSearch && activeTab === "existing",
  });

  const form = useForm<CreateStaffValues>({
    resolver: zodResolver(createStaffSchema) as any,
    defaultValues: {
      userId: "",
      name: "",
      email: "",
      password: "",
      phone: "",
      roleName: "Nhân viên",
      salary_type: null,
      permissionIds: [],
    },
  });

  const { mutate, isPending } = useCreateStaff();

  const handleSelectUser = (user: any) => {
    setSelectedUserId(user.id);
    form.setValue("userId", user.id);
    form.setValue("name", user.name);
    form.setValue("email", user.email);
    form.setValue("phone", user.sdt || "");
    toast.success(`Đã chọn nhân viên: ${user.name}`);
  };

  const onSubmit = (data: CreateStaffValues) => {
    mutate(
      { ...data, restaurantId },
      {
        onSuccess: () => {
          form.reset();
          setSelectedUserId(null);
          setSearchTerm("");
          onClose();
        },
      }
    );
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Tuyển Dụng Nhân Sự">
      <div className="mb-4 text-sm text-slate-500">
        Thêm nhân sự mới vào chi nhánh bằng cách tạo tài khoản hoặc chọn từ danh sách hệ thống.
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4 w-full">
        <Button
          type="button"
          variant={activeTab === "new" ? "white" : "gray_hover"}
          sizea="p2_1"
          className={`flex-1 rounded-lg ${activeTab === "new" ? "shadow-sm text-blue-600" : "text-slate-600"}`}
          onClick={() => setActiveTab("new")}
        >
          Tạo tài khoản mới
        </Button>
        <Button
          type="button"
          variant={activeTab === "existing" ? "white" : "gray_hover"}
          sizea="p2_1"
          className={`flex-1 rounded-lg ${activeTab === "existing" ? "shadow-sm text-blue-600" : "text-slate-600"}`}
          onClick={() => setActiveTab("existing")}
        >
          Chọn từ hệ thống
        </Button>
      </div>

      {activeTab === "existing" && (
        <Div vitri="col_none" className="mb-6 w-full space-y-4">
          <div className="relative w-full">
            <Input
              placeholder="Nhập email hoặc số điện thoại để tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 w-full"
            />
            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          
          {isSearching && <p className="text-sm text-slate-500">Đang tìm kiếm...</p>}
          
          {!isSearching && searchResults?.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-2 bg-slate-50">
              {searchResults.map((user: any) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 ${selectedUserId === user.id ? "bg-blue-100 border-blue-300 border" : "bg-white hover:bg-slate-100 border border-transparent"}`}
                >
                  <div>
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email} - {user.sdt}</p>
                  </div>
                  {selectedUserId === user.id && <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded-md">Đã chọn</span>}
                </div>
              ))}
            </div>
          )}
        </Div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Div vitri="col_none" className="grid grid-cols-2 gap-4 w-full">
          <div className="space-y-1.5 w-full">
            <Label className="font-medium text-slate-700">Tên nhân viên {activeTab === "new" && <span className="text-red-500">*</span>}</Label>
            <Input 
              {...form.register("name")} 
              placeholder="Nguyễn Văn A" 
              className="h-11 rounded-xl bg-slate-50"
              disabled={activeTab === "existing" && !!selectedUserId}
            />
            {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
          </div>
          
          <div className="space-y-1.5 w-full">
            <Label className="font-medium text-slate-700">Số điện thoại</Label>
            <Input 
              {...form.register("phone")} 
              placeholder="0912345678" 
              className="h-11 rounded-xl bg-slate-50"
              disabled={activeTab === "existing" && !!selectedUserId}
            />
            {form.formState.errors.phone && <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5 w-full">
            <Label className="font-medium text-slate-700">Email {activeTab === "new" && <span className="text-red-500">*</span>}</Label>
            <Input 
              {...form.register("email")} 
              type="email"
              placeholder="email@example.com" 
              className="h-11 rounded-xl bg-slate-50"
              disabled={activeTab === "existing" && !!selectedUserId}
            />
            {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
          </div>

          {activeTab === "new" && (
            <div className="space-y-1.5 w-full">
              <Label className="font-medium text-slate-700">Mật khẩu <span className="text-red-500">*</span></Label>
              <Input 
                {...form.register("password")} 
                type="password"
                placeholder="********" 
                className="h-11 rounded-xl bg-slate-50"
              />
              {form.formState.errors.password && <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>}
            </div>
          )}

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
            <div className="col-span-2 space-y-2 mt-2">
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
            disabled={isPending || (activeTab === "existing" && !selectedUserId)}
          >
            {isPending ? "Đang xử lý..." : "Thêm Nhân Sự"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
