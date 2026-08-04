import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, H } from "@/src/core/components/ui";
import { FaTimes, FaSave } from "react-icons/fa";
import { menuCoreSchema, MenuCoreFormValues, MenuData } from "../../schema/menu_core.schema";
import { useCreateMenu, useUpdateMenu } from "../../hook/useMenuCore";

interface MenuFormProps {
    onCancel: () => void;
    initialData?: MenuData | null;
    isEdit?: boolean;
}

const MenuForm: React.FC<MenuFormProps> = ({ onCancel, initialData, isEdit }) => {
    const { mutate: createMenu, isPending: isCreating } = useCreateMenu();
    const { mutate: updateMenu, isPending: isUpdating } = useUpdateMenu();
    
    const isPending = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<MenuCoreFormValues>({
        resolver: zodResolver(menuCoreSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            is_active: true,
            sort_order: 0
        }
    });

    useEffect(() => {
        if (initialData && isEdit) {
            reset({
                name: initialData.name,
                description: initialData.description || "",
                is_active: initialData.is_active,
                sort_order: initialData.sort_order
            });
        }
    }, [initialData, isEdit, reset]);

    const onSubmit = (data: MenuCoreFormValues) => {
        if (isEdit && initialData?.id) {
            updateMenu({ id: initialData.id, data }, {
                onSuccess: () => onCancel()
            });
        } else {
            createMenu(data, {
                onSuccess: () => onCancel()
            });
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-2xl">
                <H level={3} className="text-xl font-bold text-gray-800">
                    {isEdit ? "Cập nhật thực đơn" : "Thêm thực đơn mới"}
                </H>
                <button 
                    onClick={onCancel}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <form id="menuForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <H level={4} className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">Thông tin cơ bản</H>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên thực đơn <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("name")}
                                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="VD: Thực Đơn Sáng"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả
                            </label>
                            <textarea
                                {...register("description")}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
                                placeholder="Mô tả ngắn gọn về thực đơn..."
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thứ tự hiển thị
                                </label>
                                <input
                                    type="number"
                                    {...register("sort_order")}
                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${errors.sort_order ? 'border-red-500' : 'border-gray-200'}`}
                                />
                                {errors.sort_order && <p className="mt-1 text-sm text-red-500">{errors.sort_order.message}</p>}
                            </div>
                            
                            <div className="flex items-center mt-7">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input type="checkbox" {...register("is_active")} className="sr-only" />
                                        <div className="block bg-gray-200 w-10 h-6 rounded-full transition-colors peer-checked:bg-indigo-500"></div>
                                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
                                    </div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Đang hoạt động</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl flex justify-end gap-3">
                <Button 
                    type="button" 
                    onClick={onCancel}
                    className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                    disabled={isPending}
                >
                    Hủy bỏ
                </Button>
                <Button 
                    type="submit" 
                    form="menuForm"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                    disabled={isPending}
                >
                    <FaSave className="w-4 h-4" />
                    {isPending ? "Đang xử lý..." : "Lưu thực đơn"}
                </Button>
            </div>
        </div>
    );
};

export default MenuForm;
