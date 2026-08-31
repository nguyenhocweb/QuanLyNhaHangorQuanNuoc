"use client";
import { useEffect } from "react";
import { Div, H, P, Label, Input, Button } from "@/src/core/components/ui"
import { IoClose } from "react-icons/io5"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCategorySchema, UpdateCategoryFormValues } from "../schema/updateCategory-schema";
import { useUpdateCategoryRestaurant } from "../hook/useUpdateCategoryRestaurant_hook";
import { FiLoader, FiLayers, FiZap, FiRefreshCw } from "react-icons/fi";
import { useRandomColor } from "@/src/core/hooks/useRandomColor";
import { CategoryRestaurantTypeResponse } from "../type/categoryRestaurant";
import { CATEGORY_ICONS, PRESET_CATEGORY_ICON_NAMES } from "../constants/category_icons";

interface UpdateCategoryRestaurantProps {
    onclickClose: () => void;
    initialData: CategoryRestaurantTypeResponse;
}

const UpdateCategoryRestaurant = ({ onclickClose, initialData }: UpdateCategoryRestaurantProps) => {
    const { mutate, isPending } = useUpdateCategoryRestaurant();
    const { getLighterColor, getDarkerColor, getRandomColorPair } = useRandomColor();
    
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset
    } = useForm<UpdateCategoryFormValues>({
        resolver: zodResolver(updateCategorySchema) as any,
        defaultValues: {
            id: initialData.id,
            name: initialData.name || "",
            icon: initialData.icon || "",
            description: initialData.description || "",
            bgColor: initialData.bgColor || "#EEF2FF",
            textColor: initialData.textColor || "#6366F1"
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                id: initialData.id,
                name: initialData.name || "",
                icon: initialData.icon || "",
                description: initialData.description || "",
                bgColor: initialData.bgColor || "#EEF2FF",
                textColor: initialData.textColor || "#6366F1"
            });
        }
    }, [initialData, reset]);

    const onSubmit = (data: UpdateCategoryFormValues) => {
        mutate(data, {
            onSuccess: () => {
                onclickClose();
            }
        });
    };

    // Theo dõi giá trị color và icon để update preview
    const bgColor = watch("bgColor") || "#EEF2FF";
    const textColor = watch("textColor") || "#6366F1";
    const name = watch("name") || "Tên loại hình mẫu";
    const currentIcon = watch("icon") || "";

    return (
        <Div variant="bg_white" vitri="col_none" className=" relative w-100" style={{'--bg-color': bgColor, '--text-color': textColor} as React.CSSProperties}>
            <H variant="text_black" className="text-2xl">Cập nhật loại nhà hàng</H>
            <P>Chỉnh sửa thông tin loại hình nhà hàng</P>
            <Button className=" absolute top-2 right-2"
                onClick={() => onclickClose()}
            >
                <IoClose className="text-2xl" />
            </Button>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <Div grids="col_1" vitri='col_none' gap="g4_5" size="full" className="mt-5">
                    <Div vitri="col_none" size="full" >
                        <Label>Tên loại hình nhà hàng <span className="text-red-500">*</span></Label>
                        <Input
                            sizea="full"
                            placeholder="Nhập tên loại hình"
                            {...register("name")}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <P className="text-red-500 text-sm mt-1">{errors.name.message}</P>}
                    </Div>

                    {/* Biểu tượng Icon (Tùy chọn) */}
                    <Div vitri="col_none" size="full" className="gap-2">
                        <Label>Biểu tượng (Icon - Tùy chọn)</Label>
                        <Input
                            sizea="full"
                            placeholder="Chọn icon bên dưới hoặc nhập mã icon (VD: FiCoffee)..."
                            {...register("icon")}
                        />
                        <div className="flex flex-wrap gap-1.5 mt-1 max-h-[85px] overflow-y-auto p-1 border border-gray-100 rounded-lg bg-gray-50/50">
                            {PRESET_CATEGORY_ICON_NAMES.map((iconName) => (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => setValue("icon", iconName, { shouldValidate: true })}
                                    className={`p-1.5 rounded-lg border text-sm transition-all flex items-center justify-center ${
                                        currentIcon === iconName 
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                                            : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                                    }`}
                                    title={iconName}
                                >
                                    {CATEGORY_ICONS[iconName]}
                                </button>
                            ))}
                        </div>
                    </Div>

                    <Div vitri="col_none" size="full" className="gap-2">
                        <Div vitri="row_between" size="full">
                            <Label className="mb-0">Màu sắc (Colors)</Label>
                            <button 
                                type="button" 
                                onClick={() => {
                                    const { textColor: newText, bgColor: newBg } = getRandomColorPair();
                                    setValue("textColor", newText);
                                    setValue("bgColor", newBg);
                                }} 
                                className="text-xs text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1.5 font-medium transition-colors px-2.5 py-1.5 rounded-md"
                                title="Tạo ngẫu nhiên một cặp màu hài hòa"
                            >
                                <FiRefreshCw /> Random cặp màu
                            </button>
                        </Div>
                        <Div vitri="row_between" size="full" className="gap-4">
                            <Div vitri="col_none" className="w-1/2">
                                <Div vitri="row_between" size="full" className="mb-1">
                                    <Label className="mb-0 text-sm font-normal text-gray-600">Màu nền</Label>
                                    <button 
                                        type="button" 
                                        onClick={() => setValue("bgColor", getLighterColor(textColor))} 
                                        className="text-[11px] text-indigo-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                                        title="Tự động tạo màu nền nhạt từ màu chữ"
                                    >
                                        <FiZap /> Auto
                                    </button>
                                </Div>
                                <Input
                                    type="color"
                                    sizea="full"
                                    className="h-[40px] p-1 cursor-pointer"
                                    {...register("bgColor")}
                                />
                            </Div>
                            <Div vitri="col_none" className="w-1/2">
                                <Div vitri="row_between" size="full" className="mb-1">
                                    <Label className="mb-0 text-sm font-normal text-gray-600">Màu chữ</Label>
                                    <button 
                                        type="button" 
                                        onClick={() => setValue("textColor", getDarkerColor(bgColor))} 
                                        className="text-[11px] text-indigo-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                                        title="Tự động tạo màu chữ đậm từ màu nền"
                                    >
                                        <FiZap /> Auto
                                    </button>
                                </Div>
                                <Input
                                    type="color"
                                    sizea="full"
                                    className="h-[40px] p-1 cursor-pointer"
                                    {...register("textColor")}
                                />
                            </Div>
                        </Div>
                    </Div>
                    <Div vitri="col_none" size="full">
                        <Label>Màu sắc Preview</Label>
                        <div className="flex items-center gap-3 mt-2">
                            <Div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-xl" 
                                style={{ 
                                    backgroundColor: errors.bgColor ? '#EEF2FF' : 'var(--bg-color, #EEF2FF)', 
                                    color: errors.textColor ? '#6366F1' : 'var(--text-color, #6366F1)' 
                                }}>
                                {(currentIcon && CATEGORY_ICONS[currentIcon]) ? CATEGORY_ICONS[currentIcon] : <FiLayers />}
                            </Div>
                            <span 
                                className="font-semibold text-[14px] px-4 py-2 rounded-lg whitespace-nowrap shadow-sm border border-gray-100"
                                style={{ 
                                    backgroundColor: errors.bgColor ? '#EEF2FF' : 'var(--bg-color, #EEF2FF)', 
                                    color: errors.textColor ? '#6366F1' : 'var(--text-color, #6366F1)' 
                                }}
                            >
                                {name}
                            </span>
                        </div>
                    </Div>
                    <Div vitri="col_none" size="full">
                        <Label>Mô tả (Tùy chọn)</Label>
                        <Input
                            sizea="full"
                            placeholder="Nhập mô tả loại hình (nếu có)"
                            {...register("description")}
                        />
                    </Div>
                    <Button 
                        sizea="full" 
                        variant="indigo" 
                        className="h-[48px] text-[15px] font-semibold flex items-center justify-center gap-2 mt-4 rounded-xl shadow-md shadow-indigo-200 transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700" 
                        disabled={isPending}
                        type="submit"
                    >
                        {isPending ? (
                            <>
                                <FiLoader className="animate-spin text-lg" />
                                <span>Đang lưu thay đổi...</span>
                            </>
                        ) : (
                            "Cập nhật loại hình"
                        )}
                    </Button>
                </Div>
            </form>
        </Div>
    );
};

export default UpdateCategoryRestaurant;
