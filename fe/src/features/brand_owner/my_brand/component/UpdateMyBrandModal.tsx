import { useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { RiImageAiFill } from "react-icons/ri";
import { PiStorefrontFill } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Brand } from "@/src/features/system_admin/brands/brands_type/brand-type";
import AddressSelect from "@/src/core/components/form/AddressSelect";
import { updateMyBrandSchema, UpdateMyBrandFormValues } from "../schema/my_brand.update.schema";
import { useUpdateMyBrand } from "../hook/useUpdateMyBrand";

interface Props {
    brand: Brand;
    onClose: () => void;
}

const UpdateMyBrandModal = ({ brand, onClose }: Props) => {
    const [logoImage, setLogoImage] = useState<string | null>(brand.logo || null);
    const [biaImage, setBiaImage] = useState<string | null>(brand.imageMain || null);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const biaInputRef = useRef<HTMLInputElement>(null);

    const { mutate: updateBrand, isPending } = useUpdateMyBrand();

    const {
        register,
        watch,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<UpdateMyBrandFormValues>({
        resolver: zodResolver(updateMyBrandSchema) as any,
        defaultValues: {
            name: brand.name || "",
            taxCode: brand.taxCode || "",
            emailContact: brand.emailContact || "",
            phoneContact: brand.phoneContact || "",
            link: brand.link || "",
            address: brand.address || undefined,
            is_featured: brand.isFeatured || false,
            isVatInclusive: brand.isVatInclusive || false,
            defaultVatRate: brand.defaultVatRate || 10,
            applyServiceCharge: brand.applyServiceCharge || false,
            serviceChargeRate: brand.serviceChargeRate || 0,
            forceGlobalTaxConfig: brand.forceGlobalTaxConfig !== undefined ? brand.forceGlobalTaxConfig : true,
            inventoryApprovalThreshold: brand.inventoryApprovalThreshold || 0,
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
        const getFirstErrorMessage = (errors: any): string | undefined => {
            if (!errors) return undefined;
            if (errors.message) return errors.message as string;
            const values = Object.values(errors);
            if (values.length > 0) {
                return getFirstErrorMessage(values[0]);
            }
            return undefined;
        };
        
        const message = getFirstErrorMessage(fieldErrors);
        if (message) {
            toast.error(message);
        } else {
            toast.error("Vui lòng kiểm tra lại thông tin nhập");
        }
    };

    const handleOnSubmit = (data: UpdateMyBrandFormValues) => {
        const { FileLogo, FileImageMain, ...payload } = data;
        updateBrand({
            payload: payload,
            FileLogo: FileLogo,
            FileImageMain: FileImageMain
        }, {
            onSuccess: () => onClose()
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
            <FadeIn delay={0.1} className="w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
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
                    <form id="update-my-brand-form" onSubmit={handleSubmit(handleOnSubmit, handleOnError)} className="flex flex-col gap-10">
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
                                                {...register("taxCode")}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
                                            <input type="text" placeholder="Nhập SĐT liên hệ..."
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                {...register("phoneContact")}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email liên hệ</label>
                                            <input type="email" placeholder="example@brand.com"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                {...register("emailContact")}
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
                        
                        {/* Section 2: Cấu hình Thuế & Phí (Enterprise Governance) */}
                        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 md:p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-indigo-200/50">
                                    <PiStorefrontFill />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Cấu hình Thuế & Phí (Tax & Fees)</h3>
                                    <p className="text-slate-500 text-sm">Thiết lập chính sách thuế áp dụng cho hệ thống chi nhánh</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {/* Toggle áp dụng toàn chuỗi */}
                                <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-bold text-slate-800">Áp dụng cấu hình thuế này cho TOÀN BỘ nhà hàng</h4>
                                        <p className="text-sm text-slate-600 mt-1">
                                            Nếu Bật, các quản lý chi nhánh sẽ không thể tự sửa cấu hình thuế. Mọi hóa đơn sẽ tuân theo chính sách của thương hiệu.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                        <input type="checkbox" className="sr-only peer" {...register("forceGlobalTaxConfig")} />
                                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Cấu hình VAT */}
                                    <div className="flex flex-col gap-4 p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                                        <h4 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Thuế Giá Trị Gia Tăng (VAT)</h4>
                                        
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-700">Giá menu đã bao gồm VAT?</label>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" {...register("isVatInclusive")} />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Mức VAT mặc định (%)</label>
                                            <input type="number" step="0.1" min="0" max="100"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                {...register("defaultVatRate", { valueAsNumber: true })}
                                            />
                                        </div>
                                    </div>

                                    {/* Cấu hình Service Charge */}
                                    <div className="flex flex-col gap-4 p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                                        <h4 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Phí Dịch Vụ (Service Charge)</h4>
                                        
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-700">Áp dụng Phí dịch vụ?</label>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" {...register("applyServiceCharge")} />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        <div className={`transition-opacity ${watch("applyServiceCharge") ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tỉ lệ Phí dịch vụ (%)</label>
                                            <input type="number" step="0.1" min="0" max="100"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                {...register("serviceChargeRate", { valueAsNumber: true })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Cấu hình Kho Hàng */}
                        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 md:p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-emerald-200/50">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Cấu hình Kho Hàng</h3>
                                    <p className="text-slate-500 text-sm">Thiết lập chính sách duyệt tự động cho kho hàng chi nhánh</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-4 p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                                    <h4 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Hạn mức tự duyệt phiếu kiểm kê</h4>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Hạn mức (VNĐ)</label>
                                        <p className="text-xs text-slate-500 mb-2">Quản lý nhà hàng có thể tự duyệt các phiếu kiểm kê có giá trị chênh lệch dưới mức này.</p>
                                        <input type="number" min="0"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            {...register("inventoryApprovalThreshold", { valueAsNumber: true })}
                                        />
                                    </div>
                                </div>
                            </div>
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
                        form="update-my-brand-form"
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

export default UpdateMyBrandModal;
