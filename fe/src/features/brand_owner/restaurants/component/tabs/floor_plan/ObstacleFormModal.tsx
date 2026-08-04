import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "../../../../../../core/components/layout/public-Modal";
import { Button } from "@/src/core/components/ui";
import { ObstacleItem } from "./ObstacleNode";

const obstacleSchema = z.object({
    type: z.string(),
    text: z.string().optional(),
    tooltip: z.string().optional(),
    width: z.number().min(5, "Tối thiểu 5px"),
    height: z.number().min(5, "Tối thiểu 5px"),
    rotation: z.number().min(0).max(360),
    color: z.string().optional(),
    textColor: z.string().optional(),
    textDirection: z.enum(["horizontal", "vertical"]).optional(),
});

type ObstacleFormValues = z.infer<typeof obstacleSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    initialData: ObstacleItem | null;
    onSubmit: (data: ObstacleFormValues) => void;
}

const ObstacleFormModal: React.FC<Props> = ({ open, onClose, initialData, onSubmit }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ObstacleFormValues>({
        resolver: zodResolver(obstacleSchema) as any,
    });

    useEffect(() => {
        if (initialData && open) {
            reset({
                type: initialData.type,
                text: initialData.text || "",
                tooltip: initialData.tooltip || "",
                width: initialData.width,
                height: initialData.height,
                rotation: initialData.rotation,
                color: initialData.color || "#64748b",
                textColor: initialData.textColor || "#ffffff",
                textDirection: initialData.textDirection || "horizontal",
            });
        }
    }, [initialData, open, reset]);

    const getObstacleTypeName = (type?: string) => {
        switch (type) {
            case "WALL": return "Tường";
            case "DOOR": return "Cửa";
            case "PLANT": return "Cây cảnh";
            case "TEXT": return "Văn bản chú thích";
            case "SQUARE": return "Hình Vuông";
            case "RECTANGLE": return "Hình Chữ nhật";
            case "CIRCLE": return "Hình Tròn";
            case "OVAL": return "Hình Oval";
            case "TRIANGLE": return "Hình Tam giác";
            case "HEXAGON": return "Hình Lục giác";
            case "STAR": return "Hình Ngôi sao";
            case "LINE": return "Đường kẻ";
            default: return "Vật cản";
        }
    };

    return (
        <Modal open={open} onClose={onClose} title={`Tùy chỉnh: ${getObstacleTypeName(initialData?.type)}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                    {/* Loại hình dáng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại Hình dáng</label>
                        <select {...register("type")} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border">
                            <option value="RECTANGLE">Hình Chữ nhật</option>
                            <option value="SQUARE">Hình Vuông</option>
                            <option value="CIRCLE">Hình Tròn</option>
                            <option value="OVAL">Hình Oval</option>
                            <option value="TRIANGLE">Hình Tam giác</option>
                            <option value="HEXAGON">Hình Lục giác</option>
                            <option value="STAR">Hình Ngôi sao</option>
                            <option value="LINE">Đường kẻ</option>
                            <option value="WALL">Tường</option>
                            <option value="DOOR">Cửa</option>
                            <option value="PLANT">Cây cảnh</option>
                            <option value="TEXT">Chỉ có chữ</option>
                        </select>
                    </div>

                    {/* Tên hiển thị luôn */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên hiển thị trên đồ vật
                        </label>
                        <input 
                            {...register("text")} 
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
                            placeholder="Ví dụ: Tường khu A" 
                        />
                    </div>
                </div>

                {/* Chú thích hover */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chú thích (Chỉ hiện khi rê chuột vào)
                    </label>
                    <input 
                        {...register("tooltip")} 
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
                        placeholder="Ghi chú chi tiết cho nhân viên..." 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Chiều rộng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chiều rộng (px)</label>
                        <input 
                            type="number" 
                            {...register("width", { valueAsNumber: true })} 
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
                        />
                        {errors.width && <p className="text-red-500 text-xs mt-1">{errors.width.message}</p>}
                    </div>

                    {/* Chiều cao */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chiều cao (px)</label>
                        <input 
                            type="number" 
                            {...register("height", { valueAsNumber: true })} 
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
                        />
                        {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
                    {/* Góc xoay */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Góc xoay (0-360 độ)</label>
                        <input 
                            type="number" 
                            {...register("rotation", { valueAsNumber: true })} 
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" 
                        />
                        {errors.rotation && <p className="text-red-500 text-xs mt-1">{errors.rotation.message}</p>}
                    </div>

                    {/* Màu nền */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Màu nền</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                {...register("color")} 
                                className="h-10 w-full rounded-xl border-gray-300 shadow-sm cursor-pointer border p-1" 
                            />
                        </div>
                    </div>
                    {/* Màu chữ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Màu chữ</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                {...register("textColor")} 
                                className="h-10 w-full rounded-xl border-gray-300 shadow-sm cursor-pointer border p-1" 
                            />
                        </div>
                    </div>

                    {/* Hướng chữ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hướng chữ</label>
                        <select {...register("textDirection")} className="h-10 mt-1 block w-full rounded-xl border-gray-300 shadow-sm p-2 border">
                            <option value="horizontal">Chữ Ngang</option>
                            <option value="vertical">Chữ Dọc</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <Button type="button" variant="gray" onClick={onClose} className="px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                        Hủy
                    </Button>
                    <Button type="submit" variant="green" className="px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                        Lưu Tùy Chỉnh
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ObstacleFormModal;
