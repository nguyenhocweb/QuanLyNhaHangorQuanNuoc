import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuItemSchema, MenuItemFormValues } from "../../schema/menu_item.schema";
import { useCreateMenuItem, useUpdateMenuItem } from "../../hook/useMenuItem";
import { useGetMenuCategories } from "../../hook/useMenuCategory";
import { Div, H, Button, Input, Label, Select } from "@/src/core/components/ui";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { FaTimes, FaPlus, FaTrash, FaLayerGroup, FaImage } from "react-icons/fa";

interface ModifierGroupProps {
    control: any;
    register: any;
    index: number;
    removeGroup: (index: number) => void;
    errors: any;
}

const ModifierGroupItem = ({ control, register, index, removeGroup, errors }: ModifierGroupProps) => {
    const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
        control,
        name: `modifierGroups.${index}.options`
    });

    return (
        <div className="flex flex-col gap-4 w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative">
            <div className="absolute top-4 right-4">
                <button 
                    type="button" 
                    onClick={() => removeGroup(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa nhóm này"
                >
                    <FaTrash className="w-4 h-4" />
                </button>
            </div>
            
            <H level={6} className="text-md font-bold text-gray-700 flex items-center gap-2">
                <FaLayerGroup className="text-indigo-500" /> Nhóm tùy chọn #{index + 1}
            </H>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pr-10">
                <Div vitri="col_none" className="w-full gap-2">
                    <Label className="text-xs text-gray-500 font-semibold">Tên nhóm (Vd: Topping)</Label>
                    <Input {...register(`modifierGroups.${index}.name`)} placeholder="Tên nhóm" className="w-full h-9" />
                    {errors?.modifierGroups?.[index]?.name && <p className="text-xs text-red-500">{errors.modifierGroups[index].name.message}</p>}
                </Div>
                <Div vitri="col_none" className="w-full gap-2">
                    <Label className="text-xs text-gray-500 font-semibold">Chọn tối thiểu</Label>
                    <Input type="number" {...register(`modifierGroups.${index}.minSelections`)} placeholder="0" className="w-full h-9" />
                </Div>
                <Div vitri="col_none" className="w-full gap-2">
                    <Label className="text-xs text-gray-500 font-semibold">Chọn tối đa</Label>
                    <Input type="number" {...register(`modifierGroups.${index}.maxSelections`)} placeholder="1" className="w-full h-9" />
                </Div>
            </div>

            <div className="w-full bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-700">Các lựa chọn</span>
                    <Button 
                        type="button" 
                        onClick={() => appendOption({ name: "", priceExtra: 0 })}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                    >
                        <FaPlus className="w-3 h-3" /> Thêm lựa chọn
                    </Button>
                </div>
                
                <div className="flex flex-col gap-2 w-full">
                    {optionFields.map((optField, optIdx) => (
                        <div key={optField.id} className="flex gap-3 w-full items-start">
                            <div className="flex-1">
                                <Input {...register(`modifierGroups.${index}.options.${optIdx}.name`)} placeholder="Tên lựa chọn (Vd: Trân châu)" className="w-full h-9" />
                                {errors?.modifierGroups?.[index]?.options?.[optIdx]?.name && <p className="text-xs text-red-500 mt-1">{errors.modifierGroups[index].options[optIdx].name.message}</p>}
                            </div>
                            <div className="flex-1">
                                <Input type="number" {...register(`modifierGroups.${index}.options.${optIdx}.priceExtra`)} placeholder="Giá phụ thu" className="w-full h-9" />
                            </div>
                            <button 
                                type="button" 
                                onClick={() => removeOption(optIdx)}
                                className="mt-1 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {errors?.modifierGroups?.[index]?.options?.root && (
                        <p className="text-xs text-red-500 mt-1">{errors.modifierGroups[index].options.root.message}</p>
                    )}
                    {optionFields.length === 0 && (
                        <p className="text-xs text-gray-500 italic">Chưa có lựa chọn nào. Bấm "Thêm lựa chọn" để tiếp tục.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

interface Props {
    onCancel: () => void;
    initialData?: any;
    isEdit?: boolean;
}

const MenuItemForm = ({ onCancel, initialData, isEdit }: Props) => {
    const { mutate: createMenuItem, isPending: isCreating } = useCreateMenuItem();
    const { mutate: updateMenuItem, isPending: isUpdating } = useUpdateMenuItem();
    const isPending = isCreating || isUpdating;
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    
    const { data: catResponse } = useGetMenuCategories({ page: 1, limit: 100 });
    const categories = catResponse?.metadata?.data || [];

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<MenuItemFormValues>({
        resolver: zodResolver(menuItemSchema) as any,
        defaultValues: {
            categoryIds: initialData?.categoryMaps ? initialData.categoryMaps.map((c: any) => c.categoryId) : [],
            name: initialData?.name || "",
            description: initialData?.description || "",
            basePrice: initialData?.basePrice || 0,
            sku: initialData?.sku || "",
            is_featured: initialData?.is_featured || false,
            prep_time: initialData?.prep_time || 0,
            spice_level: initialData?.spice_level || 0,
            sort_order: initialData?.sort_order || 0,
            isActive: initialData?.isActive ?? true,
            variants: initialData?.variants || [],
            modifierGroups: initialData?.modifierGroups || [],
            restaurantIds: initialData?.restaurantIds || []
        }
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: "variants"
    });

    const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
        control,
        name: "modifierGroups"
    });

    const onSubmit = (data: MenuItemFormValues) => {
        if (isEdit && initialData?.id) {
            updateMenuItem({ id: initialData.id, data, imageFile: imageFile || undefined }, {
                onSuccess: () => {
                    onCancel();
                }
            });
        } else {
            createMenuItem({ payload: data, imageFile: imageFile || undefined }, {
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
                    <H level={4} className="text-xl font-bold text-gray-800">{isEdit ? "Cập Nhật Món Ăn" : "Thêm Món Ăn Mới"}</H>
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </Div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
                    {/* Basic Info */}
                    <Div vitri="col_none" className="w-full gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <H level={5} className="text-lg font-bold text-gray-700">Thông tin cơ bản</H>
                        
                        <div className="w-full mb-2">
                            <Label className="text-sm font-semibold text-gray-700 block mb-3">Ảnh món ăn</Label>
                            <div className="flex items-center gap-5">
                                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white overflow-hidden relative group cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-gray-400 flex flex-col items-center">
                                            <FaImage className="w-6 h-6 mb-1 text-gray-300" />
                                            <span className="text-[10px] font-medium">Tải ảnh lên</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                    {previewImage && (
                                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                                            <span className="text-white text-xs font-medium">Thay đổi</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 space-y-1.5">
                                    <p className="font-semibold text-gray-600">Yêu cầu hình ảnh:</p>
                                    <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-400"></span> Định dạng: JPG, PNG, WEBP.</p>
                                    <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-400"></span> Dung lượng: Tối đa 5MB.</p>
                                    <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-400"></span> Tỉ lệ: 1:1 (Ảnh vuông).</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <Div vitri="col_none" className="w-full gap-2">
                                <Label className="text-sm font-semibold text-gray-700">Tên món *</Label>
                                <Input {...register("name")} placeholder="Vd: Cà phê sữa đá" className="w-full" />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </Div>

                            <Div vitri="col_none" className="w-full gap-2">
                                <Label className="text-sm font-semibold text-gray-700">Danh mục *</Label>
                                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-xl bg-gray-50/50">
                                    {categories.length === 0 ? (
                                        <div className="text-sm text-red-500">Bạn chưa có danh mục nào. Hãy tạo danh mục trước!</div>
                                    ) : (
                                        categories.map((cat: any) => (
                                            <label key={cat.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200">
                                                <input 
                                                    type="checkbox"
                                                    value={cat.id}
                                                    {...register("categoryIds")}
                                                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                {errors.categoryIds && <p className="text-sm text-red-500">{errors.categoryIds.message as string}</p>}
                            </Div>

                            <Div vitri="col_none" className="w-full gap-2">
                                <Label className="text-sm font-semibold text-gray-700">Giá cơ bản (VNĐ) *</Label>
                                <Input type="number" {...register("basePrice")} placeholder="0" className="w-full" />
                                {errors.basePrice && <p className="text-sm text-red-500">{errors.basePrice.message}</p>}
                            </Div>

                            <Div vitri="col_none" className="w-full gap-2">
                                <Label className="text-sm font-semibold text-gray-700">Mã SKU</Label>
                                <Input {...register("sku")} placeholder="Để trống để hệ thống tự tạo" className="w-full" />
                                {errors.sku && <p className="text-sm text-red-500">{errors.sku.message}</p>}
                            </Div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <Div vitri="col_none" className="w-full gap-2">
                                <Label className="text-sm font-semibold text-gray-700">Thời gian chuẩn bị (phút)</Label>
                                <Input type="number" {...register("prep_time")} placeholder="0" className="w-full" />
                            </Div>

                            <Div vitri="col_none" className="w-full gap-2">
                                <Label className="text-sm font-semibold text-gray-700">Độ cay (0-5)</Label>
                                <Input type="number" min="0" max="5" {...register("spice_level")} placeholder="0" className="w-full" />
                            </Div>

                            <Div vitri="col_none" className="w-full gap-2">
                                <Label className="text-sm font-semibold text-gray-700">Thứ tự hiển thị</Label>
                                <Input type="number" {...register("sort_order")} placeholder="0" className="w-full" />
                            </Div>
                        </div>
                        
                        <div className="flex items-center gap-6 w-full mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" {...register("is_featured")} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                <span className="text-sm font-semibold text-gray-700">Món nổi bật</span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" {...register("isActive")} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                <span className="text-sm font-semibold text-gray-700">Đang hoạt động</span>
                            </label>
                        </div>
                        
                        <Div vitri="col_none" className="w-full gap-2 mt-2">
                            <Label className="text-sm font-semibold text-gray-700">Mô tả món ăn</Label>
                            <Input {...register("description")} placeholder="Mô tả ngắn gọn về món ăn này..." className="w-full" />
                        </Div>
                    </Div>

                    {/* Variants */}
                    <Div vitri="col_none" className="w-full gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <Div className="w-full flex justify-between items-center">
                            <H level={5} className="text-lg font-bold text-gray-700">Kích cỡ / Biến thể</H>
                            <Button 
                                type="button" 
                                onClick={() => appendVariant({ name: "", price: 0 })}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                            >
                                <FaPlus className="w-4 h-4" /> Thêm size
                            </Button>
                        </Div>
                        
                        <div className="flex flex-col gap-3 w-full">
                            {variantFields.map((field, index) => (
                                <div key={field.id} className="flex gap-3 w-full items-start bg-white p-3 rounded-lg border border-gray-200">
                                    <div className="flex-1">
                                        <Label className="text-xs text-gray-500 mb-1">Tên size (Vd: Size L)</Label>
                                        <Input {...register(`variants.${index}.name` as const)} placeholder="Tên size" className="w-full h-9" />
                                        {errors.variants?.[index]?.name && <p className="text-xs text-red-500 mt-1">{errors.variants[index]?.name?.message}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label className="text-xs text-gray-500 mb-1">Giá size (VNĐ)</Label>
                                        <Input type="number" {...register(`variants.${index}.price` as const)} placeholder="Giá" className="w-full h-9" />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeVariant(index)}
                                        className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {variantFields.length === 0 && (
                                <p className="text-sm text-gray-500 italic">Món ăn này chỉ có 1 mức giá mặc định. Nhấn "Thêm size" nếu có nhiều kích cỡ.</p>
                            )}
                        </div>
                    </Div>

                    {/* Modifiers */}
                    <Div vitri="col_none" className="w-full gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <Div className="w-full flex justify-between items-center">
                            <H level={5} className="text-lg font-bold text-gray-700">Nhóm Tùy Chọn (Topping, Đá, Đường...)</H>
                            <Button 
                                type="button" 
                                onClick={() => appendGroup({ name: "", minSelections: 0, maxSelections: 1, options: [{ name: "", priceExtra: 0 }] })}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                            >
                                <FaPlus className="w-4 h-4" /> Thêm nhóm tùy chọn
                            </Button>
                        </Div>
                        
                        <div className="flex flex-col gap-4 w-full">
                            {groupFields.map((field, index) => (
                                <ModifierGroupItem 
                                    key={field.id}
                                    control={control}
                                    register={register}
                                    index={index}
                                    removeGroup={removeGroup}
                                    errors={errors}
                                />
                            ))}
                            {groupFields.length === 0 && (
                                <p className="text-sm text-gray-500 italic">Món ăn này chưa có nhóm tùy chọn nào.</p>
                            )}
                        </div>
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
                            {isPending ? "Đang lưu..." : (isEdit ? "Cập Nhật" : "Lưu Món Ăn")}
                        </Button>
                    </Div>
                </form>
            </Div>
        </FadeIn>
    );
};

export default MenuItemForm;
