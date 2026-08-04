import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { validator } from "@/src/core/lib/validations";
import { Modal } from "../../../../../../core/components/layout/public-Modal";
import { Button } from "@/src/core/components/ui";

const tableSchema = z.object({
    table_number: validator.string("Số/Tên bàn"),
    table_type: z.enum(["STANDARD", "VIP", "BAR_SEATING", "SOFA", "PRIVATE_ROOM", "OUTDOOR"]).default("STANDARD"),
    min_capacity: validator.number("Sức chứa tối thiểu").min(1),
    max_capacity: validator.number("Sức chứa tối đa").min(1),
    is_vip: z.boolean().default(false),
    width: validator.number("Chiều rộng").default(80),
    height: validator.number("Chiều cao").default(80),
    rotation: validator.number("Góc xoay").default(0),
    shape: z.string().optional(),
    color: z.string().optional(),
});

type TableFormValues = z.infer<typeof tableSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    initialData?: any;
    onSubmit: (data: TableFormValues) => void;
    isLoading?: boolean;
}

const TableFormModal: React.FC<Props> = ({ open, onClose, initialData, onSubmit, isLoading }) => {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<TableFormValues>({
        resolver: zodResolver(tableSchema) as any,
        defaultValues: initialData || { min_capacity: 1, max_capacity: 4, width: 80, height: 80, rotation: 0, table_type: "STANDARD", is_vip: false }
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                reset(initialData);
            } else {
                reset({ min_capacity: 1, max_capacity: 4, width: 80, height: 80, rotation: 0, table_type: "STANDARD", is_vip: false });
            }
        }
    }, [initialData, open, reset]);

    return (
        <Modal open={open} onClose={onClose} title={initialData ? "Cấu hình Bàn" : "Thêm Bàn Mới"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên/Số bàn <span className="text-red-500">*</span></label>
                        <input {...register("table_number")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="Bàn 1" />
                        {errors.table_number && <p className="text-red-500 text-xs mt-1">{errors.table_number.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Loại bàn</label>
                        <select {...register("table_type")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                            <option value="STANDARD">Tiêu chuẩn</option>
                            <option value="VIP">VIP</option>
                            <option value="BAR_SEATING">Quầy Bar</option>
                            <option value="SOFA">Sofa</option>
                            <option value="PRIVATE_ROOM">Phòng riêng</option>
                            <option value="OUTDOOR">Ngoài trời</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sức chứa tối thiểu <span className="text-red-500">*</span></label>
                        <input type="number" {...register("min_capacity", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sức chứa tối đa <span className="text-red-500">*</span></label>
                        <input type="number" {...register("max_capacity", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Chiều rộng (px)</label>
                        <input type="number" {...register("width", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Chiều cao (px)</label>
                        <input type="number" {...register("height", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Góc xoay (°)</label>
                        <input type="number" {...register("rotation", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="is_vip" {...register("is_vip")} className="w-4 h-4 text-green-600 rounded border-gray-300" />
                    <label htmlFor="is_vip" className="text-sm font-medium text-gray-700">Đánh dấu là Bàn VIP</label>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2 border-t pt-4 border-gray-100">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Tùy chỉnh Hình dáng (Tùy chọn)</label>
                        <select {...register("shape")} className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm p-2 border">
                            <option value="">-- Mặc định theo loại bàn --</option>
                            <option value="RECTANGLE">Hình chữ nhật</option>
                            <option value="SQUARE">Hình vuông</option>
                            <option value="CIRCLE">Hình tròn</option>
                            <option value="OVAL">Hình Oval</option>
                            <option value="TRIANGLE">Hình tam giác</option>
                            <option value="HEXAGON">Hình lục giác</option>
                            <option value="STAR">Hình ngôi sao</option>
                        </select>
                        <p className="text-[10px] text-gray-500 mt-1">Lưu ý: Màu sắc của bàn đã được quy định cố định dựa trên "Loại Bàn" để dễ nhận biết.</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="gray" onClick={onClose} className="px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">Hủy</Button>
                    <Button type="submit" variant="green" disabled={isLoading} className="px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">{isLoading ? "Đang lưu..." : "Lưu bàn"}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default TableFormModal;
