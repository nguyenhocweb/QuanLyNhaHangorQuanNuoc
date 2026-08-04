"use client"
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Button } from "@/src/core/components/ui";
import { IoClose } from "react-icons/io5";
import { FiLoader, FiSave, FiMapPin, FiShield } from "react-icons/fi";
import { updateStaffSchema, UpdateStaffFormValues } from "../schema/staff.update.schema";
import { useUpdateStaff } from "../hook/useUpdateStaff";
import { useGetBrandOwnerPermissions } from "../../job_roles/hook/useGetBrandOwnerPermissions";
import { useGetRestaurants } from "../../restaurants/hook/useGetRestaurants";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    id_brand: string;
    staffData: any; // Data of the staff being edited
}

const UpdateStaffForm: React.FC<Props> = ({ isOpen, onClose, id_brand, staffData }) => {
    const { mutateAsync: updateStaff, isPending } = useUpdateStaff(id_brand);
    
    // Lấy danh sách chi nhánh
    const { data: restaurants } = useGetRestaurants(id_brand);
    // Lấy danh sách quyền hạn
    const { data: permissionsObj } = useGetBrandOwnerPermissions(id_brand);
    
    const brandPermissions = permissionsObj?.metadata?.BRAND || [];
    const restaurantPermissions = permissionsObj?.metadata?.RESTAURANT || [];

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<UpdateStaffFormValues>({
        resolver: zodResolver(updateStaffSchema) as any,
        defaultValues: {
            restaurantId: "",
            isManager: false,
            permissionIds: []
        }
    });

    const watchedRestaurantId = watch("restaurantId");
    const isManager = watch("isManager");

    // Populate form with existing data when modal opens
    useEffect(() => {
        if (isOpen && staffData) {
            setValue("restaurantId", staffData.restaurantId || "");
            // Check if user is a branch manager based on role (Assuming permissions logic or role logic)
            // If they have all branch permissions or specific role, we can set isManager
            // For now, if they don't have permissions but have a restaurant, they might be manager.
            // Wait, we don't have their role name returned in the list API right now, but let's assume they are manager if they have restaurantId and no permissions. (Actually we should return role from backend).
            // Let's just set permissionIds for now.
            const pIds = staffData.permissions?.map((p: any) => p.id) || [];
            setValue("permissionIds", pIds);
            
            // Guess isManager based on lack of permissions for a branch manager?
            // A better way is to pass role from backend, but we can do a heuristic or just leave it false.
            // If they have restaurantId and 0 permissions, they are manager.
            if (staffData.restaurantId && pIds.length === 0) {
                setValue("isManager", true);
            } else {
                setValue("isManager", false);
            }
        }
    }, [isOpen, staffData, setValue]);

    if (!isOpen) return null;

    const togglePermission = (id: string) => {
        const current = watch("permissionIds") || [];
        if (current.includes(id)) {
            setValue("permissionIds", current.filter(p => p !== id), { shouldValidate: true });
        } else {
            setValue("permissionIds", [...current, id], { shouldValidate: true });
        }
    };

    const onSubmit = async (data: UpdateStaffFormValues) => {
        if (!id_brand || !staffData) return;
        
        const payload = {
            ...data,
            restaurantId: data.restaurantId === "" ? undefined : data.restaurantId
        };

        try {
            await updateStaff({ staffId: staffData.id, data: payload });
            reset();
            onClose();
        } catch (error) {}
    };

    return (
        <FadeIn className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 sm:p-6">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl flex flex-col relative ring-1 ring-white/50 max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-6 flex justify-between items-center shrink-0 rounded-t-[24px]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/50 border border-orange-100/50 flex items-center justify-center shadow-sm">
                            <FiShield className="text-2xl text-orange-600" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Cập nhật Quyền hạn</h2>
                            <p className="text-gray-500 text-sm mt-0.5 font-medium">Nhân viên: <span className="font-bold text-gray-700">{staffData?.name}</span> ({staffData?.email})</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all duration-200 bg-gray-50 text-gray-500 hover:text-gray-800 hover:rotate-90"
                    >
                        <IoClose className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <form id="updateStaffForm" onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8 bg-[#FAFAFA] flex-1 overflow-y-auto custom-scrollbar">

                    {/* Work Location */}
                    <FadeIn delay={0.1} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">1</div>
                            <h3 className="text-lg font-bold text-gray-800 tracking-wide">Nơi làm việc</h3>
                        </div>
                        <div className="group">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                <FiMapPin className="text-gray-400 group-focus-within:text-orange-500 transition-colors" /> Chi nhánh trực thuộc
                            </label>
                            <select 
                                {...register("restaurantId")}
                                className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all duration-300 font-medium text-gray-800 cursor-pointer"
                            >
                                <option value="">--- Tất cả chi nhánh (Cấp thương hiệu) ---</option>
                                {restaurants?.map((r: any) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                            <p className="text-gray-500 text-xs mt-2 italic">Nếu không chọn, nhân viên sẽ có quyền truy cập ở cấp độ toàn thương hiệu (tùy theo phân quyền bên dưới).</p>
                        </div>
                    </FadeIn>

                    {watchedRestaurantId !== "" && (
                        <FadeIn delay={0.15} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${isManager ? 'bg-orange-50 border-orange-200' : 'bg-gray-50/50 border-transparent hover:bg-gray-100'}`}>
                                <input 
                                    type="checkbox" 
                                    {...register("isManager")}
                                    className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                                />
                                <div className="flex flex-col">
                                    <span className={`font-bold ${isManager ? 'text-orange-900' : 'text-gray-800'}`}>Nâng cấp lên Quản lý chi nhánh</span>
                                    <span className="text-sm text-gray-500">Người dùng sẽ có toàn quyền trên chi nhánh này và không cần phải tick chọn từng quyền bên dưới.</span>
                                </div>
                            </label>
                        </FadeIn>
                    )}

                    {/* Permissions */}
                    {(!watchedRestaurantId || !isManager) && (
                        <FadeIn delay={0.2} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm">2</div>
                                <h3 className="text-lg font-bold text-gray-800 tracking-wide">Phân quyền chức năng</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-8">
                                {/* Brand Permissions (Only if no restaurant selected) */}
                                {!watchedRestaurantId && (
                                    <div className="flex flex-col">
                                        <h4 className="font-bold text-indigo-700 mb-4 pb-2 border-b border-indigo-100 flex items-center gap-2">
                                            <FiShield /> Quyền cấp Thương hiệu
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {brandPermissions?.map((p: any) => {
                                                const isChecked = watch("permissionIds")?.includes(p.id);
                                                return (
                                                    <label key={p.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50/50 border-transparent hover:bg-gray-100'}`}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={isChecked}
                                                            onChange={() => togglePermission(p.id)}
                                                            className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 shrink-0"
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className={`font-semibold text-sm ${isChecked ? 'text-indigo-900' : 'text-gray-700'}`}>{p.name}</span>
                                                            <span className="text-xs text-gray-500 mt-0.5">{p.description}</span>
                                                        </div>
                                                    </label>
                                                )
                                            })}
                                            {brandPermissions.length === 0 && <span className="text-sm text-gray-500">Đang tải...</span>}
                                        </div>
                                    </div>
                                )}

                                {/* Restaurant Permissions (Only if restaurant is selected and not manager) */}
                                {watchedRestaurantId && !isManager && (
                                    <div className="flex flex-col">
                                        <h4 className="font-bold text-orange-700 mb-4 pb-2 border-b border-orange-100 flex items-center gap-2">
                                            <FiShield /> Quyền cấp Chi nhánh
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {restaurantPermissions?.map((p: any) => {
                                                const isChecked = watch("permissionIds")?.includes(p.id);
                                                return (
                                                    <label key={p.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-orange-50 border-orange-200' : 'bg-gray-50/50 border-transparent hover:bg-gray-100'}`}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={isChecked}
                                                            onChange={() => togglePermission(p.id)}
                                                            className="mt-1 w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 shrink-0"
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className={`font-semibold text-sm ${isChecked ? 'text-orange-900' : 'text-gray-700'}`}>{p.name}</span>
                                                            <span className="text-xs text-gray-500 mt-0.5">{p.description}</span>
                                                        </div>
                                                    </label>
                                                )
                                            })}
                                            {restaurantPermissions.length === 0 && <span className="text-sm text-gray-500">Đang tải...</span>}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {errors.permissionIds && <p className="text-red-500 text-xs font-medium pl-1 mt-3">{errors.permissionIds.message as string}</p>}
                        </FadeIn>
                    )}

                </form>

                {/* Footer */}
                <div className="shrink-0 flex justify-end gap-4 px-8 py-6 bg-white border-t border-gray-100 rounded-b-[24px]">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 hover:-translate-y-0.5"
                        disabled={isPending}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="submit"
                        form="updateStaffForm"
                        disabled={isPending}
                        className="px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {isPending ? <FiLoader className="animate-spin text-xl" /> : <FiSave className="text-xl" />}
                        {isPending ? "Đang xử lý..." : "Cập nhật quyền hạn"}
                    </Button>
                </div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #d1d5db; }
            `}</style>
        </FadeIn>
    );
};

export default UpdateStaffForm;
