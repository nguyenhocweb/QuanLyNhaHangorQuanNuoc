import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { validator } from "@/src/core/lib/validations";
import { Modal } from "@/src/core/components/layout/public-Modal";
import { Button } from "@/src/core/components/ui";

const areaSchema = z.object({
    name: validator.string("Tên khu vực"),
    description: z.string().optional(),
    floor_number: validator.number("Số tầng"),
    width: validator.number("Chiều rộng lưới (px)").default(800),
    height: validator.number("Chiều cao lưới (px)").default(600),
    background_url: z.string().optional(),
    is_outdoor: z.boolean().default(false),
    smoking_allowed: z.boolean().default(true),
});

type AreaFormValues = z.infer<typeof areaSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    initialData?: any;
    onSubmit: (data: AreaFormValues) => void;
    isLoading?: boolean;
}

const AreaFormModal: React.FC<Props> = ({ open, onClose, initialData, onSubmit, isLoading }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<AreaFormValues>({
        resolver: zodResolver(areaSchema) as any,
        defaultValues: initialData || { width: 800, height: 600, floor_number: 1, is_outdoor: false, smoking_allowed: true }
    });

    return (
        <Modal open={open} onClose={onClose} title={initialData ? "Sửa khu vực" : "Thêm khu vực"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên khu vực <span className="text-red-500">*</span></label>
                    <input {...register("name")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="VD: Tầng 1, Sân vườn" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số tầng <span className="text-red-500">*</span></label>
                    <input type="number" {...register("floor_number", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                    {errors.floor_number && <p className="text-red-500 text-xs mt-1">{errors.floor_number.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Chiều rộng (px)</label>
                        <input type="number" {...register("width", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Chiều cao (px)</label>
                        <input type="number" {...register("height", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea {...register("description")} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                </div>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_outdoor" {...register("is_outdoor")} className="w-4 h-4 text-green-600 rounded border-gray-300" />
                        <label htmlFor="is_outdoor" className="text-sm font-medium text-gray-700">Khu vực ngoài trời</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="smoking_allowed" {...register("smoking_allowed")} className="w-4 h-4 text-green-600 rounded border-gray-300" />
                        <label htmlFor="smoking_allowed" className="text-sm font-medium text-gray-700">Cho phép hút thuốc</label>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="gray" onClick={onClose} className="px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">Hủy</Button>
                    <Button type="submit" variant="green" disabled={isLoading} className="px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">{isLoading ? "Đang lưu..." : "Lưu khu vực"}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AreaFormModal;
