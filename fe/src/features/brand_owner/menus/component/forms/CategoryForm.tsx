import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuCategorySchema, MenuCategoryFormValues } from "../../schema/menu_category.schema";
import { useCreateMenuCategory, useUpdateMenuCategory } from "../../hook/useMenuCategory";
import { useGetMenus } from "../../hook/useMenuCore";
import { Div, H, Button, Input, Label } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaTimes } from "react-icons/fa";

interface Props {
    onCancel: () => void;
    initialData?: any;
    isEdit?: boolean;
}

const CategoryForm = ({ onCancel, initialData, isEdit }: Props) => {
    const { mutate: createCategory, isPending: isCreating } = useCreateMenuCategory();
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateMenuCategory();
    const isPending = isCreating || isUpdating;

    const { data: menuResponse, isLoading: isLoadingMenus } = useGetMenus({ page: 1, limit: 100, is_active: true });
    const menus = menuResponse?.metadata?.data || [];

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<MenuCategoryFormValues>({
        resolver: zodResolver(menuCategorySchema) as any,
        defaultValues: {
            menuIds: initialData?.menuMaps ? initialData.menuMaps.map((m: any) => m.menuId) : [],
            name: initialData?.name || "",
            description: initialData?.description || "",
            sort_order: initialData?.sort_order || 0,
            is_active: initialData?.is_active ?? true
        }
    });

    const onSubmit = (data: MenuCategoryFormValues) => {
        if (isEdit && initialData?.id) {
            updateCategory({ id: initialData.id, data }, {
                onSuccess: () => {
                    onCancel();
                }
            });
        } else {
            createCategory(data, {
                onSuccess: () => {
                    onCancel();
                }
            });
        }
    };

    return (
        <FadeIn className="w-full">
            <Div vitri="col_none" className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-6">
                <Div className="w-full flex items-center justify-between">
                    <H level={4} className="text-xl font-bold text-gray-800">{isEdit ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}</H>
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </Div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
                    <Div vitri="col_none" className="w-full gap-2">
                        <Label className="text-sm font-semibold text-gray-700">Thuộc Thực đơn *</Label>
                        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-xl bg-gray-50/50">
                            {isLoadingMenus ? (
                                <div className="text-sm text-gray-500">Đang tải danh sách thực đơn...</div>
                            ) : menus.length === 0 ? (
                                <div className="text-sm text-red-500">Bạn chưa có thực đơn nào. Hãy tạo thực đơn trước!</div>
                            ) : (
                                menus.map((m: any) => (
                                    <label key={m.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200">
                                        <input 
                                            type="checkbox"
                                            value={m.id}
                                            {...register("menuIds")}
                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{m.name}</span>
                                    </label>
                                ))
                            )}
                        </div>
                        {errors.menuIds && <p className="text-sm text-red-500">{errors.menuIds.message as string}</p>}
                    </Div>

                    <Div vitri="col_none" className="w-full gap-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Tên danh mục *</Label>
                        <Input 
                            id="name"
                            {...register("name")}
                            placeholder="Vd: Khai vị, Đồ uống..."
                            className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </Div>

                    <Div vitri="col_none" className="w-full gap-2">
                        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Mô tả (không bắt buộc)</Label>
                        <Input 
                            id="description"
                            {...register("description")}
                            placeholder="Mô tả ngắn gọn về danh mục"
                            className="w-full"
                        />
                    </Div>

                    <Div vitri="col_none" className="w-full gap-2">
                        <Label htmlFor="sort_order" className="text-sm font-semibold text-gray-700">Thứ tự hiển thị (Ưu tiên)</Label>
                        <Input 
                            id="sort_order"
                            type="number"
                            min="0"
                            {...register("sort_order")}
                            placeholder="Vd: 0, 1, 2..."
                            className="w-full"
                        />
                        <p className="text-xs text-gray-500">Số càng nhỏ, danh mục càng xuất hiện lên trên (Ví dụ: 0 là cao nhất).</p>
                    </Div>

                    <Div className="w-full flex justify-end gap-3 mt-4">
                        <Button 
                            type="button" 
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                            onClick={onCancel}
                        >
                            Hủy
                        </Button>
                        <Button 
                            type="submit" 
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                            disabled={isPending}
                        >
                            {isPending ? "Đang lưu..." : (isEdit ? "Cập Nhật" : "Lưu Danh Mục")}
                        </Button>
                    </Div>
                </form>
            </Div>
        </FadeIn>
    );
};

export default CategoryForm;
