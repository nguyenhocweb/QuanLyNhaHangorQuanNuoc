"use client"
import { Div, H, P, Label, Input, Button } from "@/src/core/components/ui"
import { useState, useRef } from "react"
import FadeIn from "@/src/core/components/animation/FadeIn"
import { IoClose } from "react-icons/io5";
import { RiImageAiFill, RiShieldUserFill } from "react-icons/ri";
import { PiStorefrontFill } from "react-icons/pi";
import { BsExclamationCircleFill } from "react-icons/bs";
import { MdPersonSearch } from "react-icons/md";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { IoIosRocket } from "react-icons/io";
import { FiArrowRight } from "react-icons/fi";
import ToggleSwitch from "@/src/core/components/layout/ToggleSwitch";
import useDebounce from "@/src/core/hooks/useDebounce";

import { useForm } from "react-hook-form";
import { useCreateBrand } from "../brands_hook/useCreateBrand_hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBrandFormValues, CreateBrandSchema } from "../brands_schemas/CreateBrand_Schemas";
import { toast } from "sonner";
import { useFindUserBrandOwner } from "@/src/features/system_admin/users/hook/useFindUserBrandOwner";
import AddressSelect from "@/src/core/components/form/AddressSelect";
const Create_Brand_form = () => {

    const [openForm, setOpenForm] = useState<boolean>(false);
    const [idBrandOwner, setIdBrandOwner] = useState<string | null>(null)
    const [logoImage, setLogoImage] = useState<string | null>(null);
    const [biaImage, setBiaImage] = useState<string | null>(null);
    const [otherImages, setOtherImages] = useState<{file: File, url: string}[]>([]);
    const [searchUserTerm, setSearchUserTerm] = useState("");

    const logoInputRef = useRef<HTMLInputElement>(null);
    const biaInputRef = useRef<HTMLInputElement>(null);
    const otherImagesInputRef = useRef<HTMLInputElement>(null);

    const debouncedSearchUser = useDebounce({ value: searchUserTerm, delay: 500 });
    const { data: usersData, isLoading: isLoadingUsers } = useFindUserBrandOwner(debouncedSearchUser as string);
    const searchedUsers = usersData || [];

    const { mutate: CreateBrand, isPending } = useCreateBrand()
    const {
        register,
        watch,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<CreateBrandFormValues>({
        resolver: zodResolver(CreateBrandSchema) as any,
        defaultValues: {
            is_featured: true,
            FileLogo: undefined,
            FileImageMain: undefined,
            brand_owner_id: "",
            address: undefined,
        }
    })

    const handleLogoClick = () => {
        logoInputRef.current?.click();
    };

    const handleBiaClick = () => {
        biaInputRef.current?.click();
    };

    const handleOtherImagesClick = () => {
        otherImagesInputRef.current?.click();
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setLogoImage(objectUrl);
            setValue("FileLogo", file, { shouldValidate: true, shouldDirty: true })
        }
    };

    const handleBiaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setBiaImage(objectUrl);
            setValue("FileImageMain", file, { shouldValidate: true, shouldDirty: true })
        }
    };

    const handleOtherImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            const newImages = files.map(file => ({
                file,
                url: URL.createObjectURL(file)
            }));
            const updatedImages = [...otherImages, ...newImages];
            setOtherImages(updatedImages);
            setValue("FileImages", updatedImages.map(img => img.file), { shouldValidate: true, shouldDirty: true });
        }
        // Reset input value to allow selecting same file again if removed
        if (otherImagesInputRef.current) {
            otherImagesInputRef.current.value = '';
        }
    };

    const handleRemoveOtherImage = (indexToRemove: number) => {
        const updatedImages = otherImages.filter((_, idx) => idx !== indexToRemove);
        setOtherImages(updatedImages);
        setValue("FileImages", updatedImages.length > 0 ? updatedImages.map(img => img.file) : undefined, { shouldValidate: true, shouldDirty: true });
    };

    const HandleOnError = (fieldErrors: any) => {
        const errorValues = Object.values(fieldErrors);
        if (errorValues.length > 0) {
            const firstError: any = errorValues[0];
            toast.error(firstError.message);
        }
    }

    const HandleOnSubmit = (data: CreateBrandFormValues) => {
        CreateBrand(data, {
            onSuccess: () => {
                setOpenForm(false);
                reset();
                setLogoImage(null);
                setBiaImage(null);
                setOtherImages([]);
                setIdBrandOwner(null);
            }
        });
    }

    return (
        <>
            <FadeIn className="w-full" delay={0.5}>
                <div className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                    
                    <div className="relative z-10 flex flex-col items-start gap-4">
                        <div className="flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
                            <IoIosRocket className="text-xl" />
                            <span className="text-sm font-medium tracking-wide">Mở rộng kinh doanh</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Đăng ký thương hiệu</h2>
                            <p className="text-blue-100 text-sm md:text-base max-w-sm leading-relaxed">
                                Khởi tạo đối tác mới, gán quyền sở hữu và bắt đầu quản lý chuỗi nhà hàng ngay hôm nay.
                            </p>
                        </div>
                        <button 
                            onClick={() => setOpenForm(true)}
                            className="mt-4 bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                        >
                            Khởi tạo ngay <FiArrowRight className="text-lg" />
                        </button>
                    </div>
                </div>
            </FadeIn>

            {openForm &&
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
                    <FadeIn delay={0.1} className="w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Đăng ký thương hiệu mới</h2>
                                <p className="text-slate-500 text-sm mt-1">Điền thông tin pháp lý và thiết lập quyền quản trị viên.</p>
                            </div>
                            <button 
                                onClick={() => setOpenForm(false)}
                                className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            >
                                <IoClose className="text-xl" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <form id="create-brand-form" onSubmit={handleSubmit(HandleOnSubmit, HandleOnError)} className="flex flex-col gap-10">
                                
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
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mã số thuế <span className="text-red-500">*</span></label>
                                                    <input type="text" placeholder="Nhập MST..."
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                        {...register("tax_code")}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                                                    <input type="text" placeholder="Nhập SĐT liên hệ..."
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                        {...register("phone_contact")}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email liên hệ <span className="text-red-500">*</span></label>
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
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả thương hiệu</label>
                                                <textarea
                                                    className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-h-[100px] resize-none overflow-y-auto`}
                                                    placeholder="Nhập mô tả ngắn về thương hiệu (không bắt buộc)..."
                                                    {...register("description")}
                                                ></textarea>
                                            </div>
                                            <div className="col-span-full mt-2">
                                                <h4 className="text-sm font-semibold text-slate-700 mb-4">Địa chỉ trụ sở <span className="text-red-500">*</span></h4>
                                                <AddressSelect 
                                                    value={watch("address") as any}
                                                    onChange={(val) => setValue("address", val, { shouldValidate: true })}
                                                />
                                            </div>
                                        </div>

                                        {/* Cột phải: Ảnh */}
                                        <div className="w-full lg:w-72 flex flex-col gap-6">
                                            {/* Logo */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Logo thương hiệu <span className="text-red-500">*</span></label>
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
                                                            <span className="text-xs text-slate-500 font-medium">Tải Logo lên</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Ảnh bìa */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Ảnh bìa chính <span className="text-red-500">*</span></label>
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
                                                            <span className="text-xs text-slate-500 font-medium">Tải ảnh bìa (Banner)</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Ảnh khác */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Ảnh khác (Không bắt buộc)</label>
                                                <input type="file" ref={otherImagesInputRef} onChange={handleOtherImagesChange} accept="image/*" multiple className="hidden" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    {otherImages.map((img, idx) => (
                                                        <div key={idx} className="relative w-full h-24 rounded-xl border border-slate-200 overflow-hidden group">
                                                            <img src={img.url} alt={`Other ${idx}`} className="object-cover w-full h-full" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <button 
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); handleRemoveOtherImage(idx); }}
                                                                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                                >
                                                                    <IoClose className="text-sm" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div 
                                                        className="w-full h-24 rounded-xl bg-white border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all group"
                                                        onClick={handleOtherImagesClick}
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mb-1 group-hover:bg-blue-100 transition-colors">
                                                            <span className="text-xl text-slate-400 group-hover:text-blue-500 font-medium">+</span>
                                                        </div>
                                                        <span className="text-xs text-slate-500 font-medium">Thêm ảnh</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Gán quyền */}
                                <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 md:p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-indigo-200/50">
                                            <RiShieldUserFill />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Bàn giao quyền lực</h3>
                                            <p className="text-slate-500 text-sm">Xác định chủ sở hữu hợp pháp trên hệ thống</p>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-indigo-100 border-l-4 border-l-indigo-500 rounded-xl p-4 mb-6 flex gap-3 items-start shadow-sm">
                                        <BsExclamationCircleFill className="text-indigo-500 text-lg shrink-0 mt-0.5" />
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Chọn người dùng sẽ nhận quyền quản trị cao nhất cho thương hiệu này. 
                                            Hệ thống sẽ tạo tài khoản Employment đầu tiên cho người này với vai trò <span className="font-bold text-slate-800">Brand Admin</span>.
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Tìm kiếm chủ sở hữu <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MdPersonSearch className="text-slate-400 text-xl" />
                                            </div>
                                            <input 
                                                type="text" 
                                                className="w-full sm:w-2/3 bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                                                placeholder="Nhập tên, email hoặc SĐT để tìm kiếm..."
                                                onChange={(e) => setSearchUserTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Danh sách User */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {isLoadingUsers && <div className="col-span-full py-4 text-slate-500 text-sm flex items-center gap-2"><div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div> Đang tìm kiếm...</div>}
                                        {!isLoadingUsers && searchedUsers.length === 0 && searchUserTerm !== "" && (
                                            <div className="col-span-full py-4 text-red-500 text-sm">Không tìm thấy người dùng phù hợp.</div>
                                        )}
                                        {!isLoadingUsers && searchUserTerm === "" && searchedUsers.length === 0 && (
                                            <div className="col-span-full py-2 text-slate-400 text-sm italic">Vui lòng nhập từ khóa để tìm kiếm...</div>
                                        )}

                                        {!isLoadingUsers && searchedUsers.map((e: any) => {
                                            const isSelected = idBrandOwner === e.id;
                                            return (
                                                <div 
                                                    key={e.id}
                                                    onClick={() => { 
                                                        setIdBrandOwner(e.id); 
                                                        setValue("brand_owner_id", e.id, { shouldValidate: true });
                                                    }}
                                                    className={`
                                                        flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border-2
                                                        ${isSelected 
                                                            ? 'bg-indigo-50 border-indigo-500 shadow-md' 
                                                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-4 overflow-hidden">
                                                        <img src={e.avatar || "https://ui-avatars.com/api/?name=User"} alt={e.name} className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" />
                                                        <div className="overflow-hidden">
                                                            <h4 className={`font-semibold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{e.name}</h4>
                                                            <p className="text-xs text-slate-500 truncate">{e.email}</p>
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <IoCheckmarkCircleSharp className="text-indigo-600 text-2xl shrink-0" />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Section 3: Cấu hình */}
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
                                onClick={() => setOpenForm(false)}
                                className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                type="submit"
                                form="create-brand-form"
                                disabled={isPending}
                                className={`
                                    flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all
                                    ${isPending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5'}
                                `}
                            >
                                {isPending ? 'Đang xử lý...' : 'Xác nhận khởi tạo'} <IoIosRocket className={isPending ? 'animate-pulse' : ''} />
                            </button>
                        </div>
                    </FadeIn>
                </div>
            }
        </>
    )
}
export default Create_Brand_form;