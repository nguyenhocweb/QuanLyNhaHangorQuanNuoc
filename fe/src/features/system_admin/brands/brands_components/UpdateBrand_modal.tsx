import { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { RiImageAiFill } from "react-icons/ri";
import { PiStorefrontFill } from "react-icons/pi";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import ToggleSwitch from "@/src/core/components/layout/ToggleSwitch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Brand } from "../brands_type/brand-type";
import { useUpdateBrand } from "../brands_hook/useUpdateBrand_hook";
import { z } from "zod";
import AddressSelect from "@/src/core/components/form/AddressSelect";

const UpdateBrandSchema = z.object({
    name: z.string().min(1, "Tên thương hiệu không được để trống"),
    tax_code: z.string().max(100, "Mã số thuế không được vượt quá 100 ký tự").optional().or(z.literal("")),
    email_contact: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
    phone_contact: z.string().max(20, "Số điện thoại không được vượt quá 20 ký tự").optional().or(z.literal("")),
    link: z.string().url("Website/Link không hợp lệ").max(255, "Website/Link không được vượt quá 255 ký tự").optional().or(z.literal("")),
    address: z.object({
        street: z.string().optional(),
        ward: z.string().optional(),
        wardCode: z.string().optional(),
        district: z.string().optional(),
        districtCode: z.string().optional(),
        province: z.string().optional(),
        provinceCode: z.string().optional()
    }).optional(),
    is_featured: z.boolean().optional(),
    FileLogo: z.any().optional(),
    FileImageMain: z.any().optional(),
});
type UpdateBrandFormValues = z.infer<typeof UpdateBrandSchema>;

interface Props {
    brand: Brand;
    onClose: () => void;
}

const UpdateBrand_modal = ({ brand, onClose }: Props) => {
    const [logoImage, setLogoImage] = useState<string | null>(brand.logo || null);
    const [biaImage, setBiaImage] = useState<string | null>(brand.imageMain || null);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const biaInputRef = useRef<HTMLInputElement>(null);

    const { mutate: updateBrand, isPending } = useUpdateBrand();

    const {
        register,
        watch,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<UpdateBrandFormValues>({
        resolver: zodResolver(UpdateBrandSchema),
        defaultValues: {
            name: brand.name || "",
            tax_code: brand.tax_code || "",
            email_contact: brand.email_contact || "",
            phone_contact: brand.phone_contact || "",
            link: brand.link || "",
            address: brand.address || undefined,
            is_featured: brand.isFeatured || false,
        }
    });

    const handleLogoClick = () => logoInputRef.current?.click();
    const handleBiaClick = () => biaInputRef.current?.click();

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLogoImage(URL.createObjectURL(file));
            setValue("FileLogo", file, { shouldValidate: true, shouldDirty: true });
        }
    };

    const handleBiaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setBiaImage(URL.createObjectURL(file));
            setValue("FileImageMain", file, { shouldValidate: true, shouldDirty: true });
        }
    };

    const handleOnError = (fieldErrors: any) => {
        const errorValues = Object.values(fieldErrors);
        if (errorValues.length > 0) {
            const firstError: any = errorValues[0];
            toast.error(firstError.message);
        }
    };

    const handleOnSubmit = (data: UpdateBrandFormValues) => {
        const { FileLogo, FileImageMain, ...payload } = data;
        updateBrand({
            id: brand.id,
            payload: payload,
            FileLogo: FileLogo,
            FileImageMain: FileImageMain
        }, {
            onSuccess: () => onClose()
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
            <FadeIn delay={0.1} className="w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Cập nhật thông tin thương hiệu</h2>
                        <p className="text-slate-500 text-sm mt-1">Chỉnh sửa thông tin pháp lý và nhận diện của {brand.name}.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                        <IoClose className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form id="update-brand-form" onSubmit={handleSubmit(handleOnSubmit, handleOnError)} className="flex flex-col gap-10">
                        {/* Section 1: Thông tin cơ bản */}
                        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 md:p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-blue-200/50">
                                    <PiStorefrontFill />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Thông tin thương hiệu</h3>
                                    <p className="text-slate-500 text-sm">Thông tin nhận diện và liên hệ cơ bản</p>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Cột trái: Inputs */}
                                <div className="flex-1 flex flex-col gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tên thương hiệu <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="VD: Nhà hàng Sen Tây Hồ"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            {...register("name")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Mã số thuế</label>
                                            <input type="text" placeholder="Nhập MST..."
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                {...register("tax_code")}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
                                            <input type="text" placeholder="Nhập SĐT liên hệ..."
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                {...register("phone_contact")}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email liên hệ</label>
                                            <input type="email" placeholder="example@brand.com"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                {...register("email_contact")}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                                            <input type="text" placeholder="https://..."
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                {...register("link")}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-full mt-2">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-4">Địa chỉ trụ sở</h4>
                                        <AddressSelect 
                                            value={watch("address") as any}
                                            onChange={(val) => setValue("address", val, { shouldValidate: true, shouldDirty: true })}
                                        />
                                    </div>
                                </div>

                                {/* Cột phải: Ảnh */}
                                <div className="w-full lg:w-72 flex flex-col gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Logo thương hiệu</label>
                                        <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
                                        <div 
                                            className="w-32 h-32 rounded-2xl bg-white border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all group"
                                            onClick={handleLogoClick}
                                        >
                                            {logoImage ? (
                                                <img src={logoImage} alt="Logo preview" className="object-cover w-full h-full" />
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                                                        <RiImageAiFill className="text-xl text-slate-400 group-hover:text-blue-500" />
                                                    </div>
                                                    <span className="text-xs text-slate-500 font-medium">Tải Logo mới</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Ảnh bìa chính</label>
                                        <input type="file" ref={biaInputRef} onChange={handleBiaChange} accept="image/*" className="hidden" />
                                        <div 
                                            className="w-full h-40 rounded-2xl bg-white border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all group"
                                            onClick={handleBiaClick}
                                        >
                                            {biaImage ? (
                                                <img src={biaImage} alt="Cover preview" className="object-cover w-full h-full" />
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                                                        <RiImageAiFill className="text-xl text-slate-400 group-hover:text-blue-500" />
                                                    </div>
                                                    <span className="text-xs text-slate-500 font-medium">Tải ảnh bìa mới</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Cấu hình */}
                        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 md:p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-amber-200/50">
                                    <TbAdjustmentsHorizontal />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Thương hiệu tiêu biểu</h3>
                                    <p className="text-slate-500 text-sm">Ưu tiên hiển thị trên trang chủ và danh sách khám phá.</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                checked={!!watch("is_featured")}
                                onChange={(newValue: boolean) => { setValue("is_featured", newValue, { shouldValidate: true }) }}
                                color="blue"
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-4 items-center">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        type="submit"
                        form="update-brand-form"
                        disabled={isPending}
                        className={`
                            px-8 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all
                            ${isPending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5'}
                        `}
                    >
                        {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </FadeIn>
        </div>
    );
};

export default UpdateBrand_modal;
