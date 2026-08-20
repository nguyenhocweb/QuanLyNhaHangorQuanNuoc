"use client"
import { Div, H, P, Button } from "@/src/core/components/ui"
import { FiX, FiCheck, FiSearch, FiUploadCloud, FiImage, FiTrash2 } from "react-icons/fi"
import { useForm, Controller } from "react-hook-form"
import FadeIn from "@/src/core/components/animation/FadeIn";
import { zodResolver } from "@hookform/resolvers/zod"
import { createRestaurantSchema, CreateRestaurantFormValues } from "../schema/createRestaurant-schema"
import { useCreateRestaurant } from "../hook/useCreateRestaurant_hook"
import { useState, useRef, useEffect } from "react"
import { useBrandCard_hook } from "@/src/features/public/brands/hooks/useBrandCard_hook"
import { useCategoryRestaurant } from "../../categories/hook/useCategoryRestaurant_hook"
import { useUpdateCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/useUpdateCloudinary"
import { useUploadMultipleCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/useUploadMultipleCloudinary"
import { toast } from "sonner"
import useDebounce from "@/src/core/hooks/useDebounce"
import AddressSelect from "@/src/core/components/form/AddressSelect"

const CreateRestaurant = ({ onclickClose }: { onclickClose: () => void }) => {
    const { mutate, isPending: isCreating } = useCreateRestaurant();
    const { mutateAsync: uploadSingle } = useUpdateCloudinary();
    const { mutateAsync: uploadMultiple } = useUploadMultipleCloudinary();
    const [isUploading, setIsUploading] = useState(false);
    
    // Brand search state
    const [brandSearch, setBrandSearch] = useState("");
    const debouncedBrandSearch = useDebounce({ value: brandSearch, delay: 500 });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: brandData, isLoading: isLoadingBrands } = useBrandCard_hook({ page: 1, limit: 100, search: "" });
    const allBrands = brandData?.data || [];
    const brands = allBrands.filter((b: any) => b.name.toLowerCase().includes(debouncedBrandSearch.toLowerCase()));

    // Categories
    const { data: categoryData } = useCategoryRestaurant({ page: 1, limit: 100, search: "", status: "true" });
    const categories = categoryData?.data || [];

    // Image previews
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [mainPreview, setMainPreview] = useState<string | null>(null);
    const [imagesPreview, setImagesPreview] = useState<{url: string, file: File}[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<CreateRestaurantFormValues>({
        resolver: zodResolver(createRestaurantSchema),
        defaultValues: {
            name: "", address: {}, emailContact: "", phoneContact: "", description: "",
            maxPartySize: 50, bookingWindowDays: 7, cancellationHours: 24,
            depositRequired: false, depositPerPax: 0,
            categoryIds: [], brandId: ""
        }
    });

    const selectedBrandId = watch("brandId");

    // Handlers
    const handleSearchBrand = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setBrandSearch(val);
        setIsDropdownOpen(true);
        if (val === "") {
            setValue("brandId", "", { shouldValidate: true });
        }
    };

    const handleSelectBrand = (id: string, name: string) => {
        setValue("brandId", id, { shouldValidate: true });
        setBrandSearch(name);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Image Handlers
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("logoFile", file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("imageMainFile", file, { shouldValidate: true });
            setMainPreview(URL.createObjectURL(file));
        }
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length) {
            const newPreviews = files.map(file => ({ url: URL.createObjectURL(file), file }));
            setImagesPreview(prev => [...prev, ...newPreviews]);
            const currentFiles = watch("imagesFiles") || [];
            setValue("imagesFiles", [...currentFiles, ...files]);
        }
    };

    const removeImage = (index: number) => {
        setImagesPreview(prev => prev.filter((_, i) => i !== index));
        const currentFiles = watch("imagesFiles") || [];
        setValue("imagesFiles", currentFiles.filter((_: any, i: number) => i !== index));
    };

    const toggleCategory = (id: string) => {
        const current = watch("categoryIds") || [];
        if (current.includes(id)) {
            setValue("categoryIds", current.filter(c => c !== id), { shouldValidate: true });
        } else {
            setValue("categoryIds", [...current, id], { shouldValidate: true });
        }
    };

    const onSubmit = async (data: CreateRestaurantFormValues) => {
        const toastId = toast.loading("Đang khởi tạo thông tin...");
        try {
            setIsUploading(true);
            let logoUrl = "";
            let mainUrl = "";
            let galleryUrls: string[] = [];

            if (data.logoFile || data.imageMainFile || (data.imagesFiles && data.imagesFiles.length > 0)) {
                toast.loading("Đang tải hình ảnh lên hệ thống...", { id: toastId });
            }

            const tempId = `temp_${Date.now()}`;

            // Upload Logo
            if (data.logoFile) {
                logoUrl = await uploadSingle({ folder: `/restaurants/${tempId}/logo`, file: data.logoFile, public_idfe: "logo" });
            }

            // Upload Main Image
            if (data.imageMainFile) {
                mainUrl = await uploadSingle({ folder: `/restaurants/${tempId}/imageMain`, file: data.imageMainFile, public_idfe: "imageMain" });
            }

            // Upload Gallery
            if (data.imagesFiles && data.imagesFiles.length > 0) {
                const items = data.imagesFiles.map((file: File, index: number) => ({
                    file, public_id: `gallery_${index}`
                }));
                galleryUrls = await uploadMultiple({ folder: `/restaurants/${tempId}/gallery`, items });
            }

            toast.loading("Đang lưu thông tin nhà hàng mới...", { id: toastId });

            const payload: any = {
                ...data,
                logo: logoUrl,
                imageMain: mainUrl,
                images: galleryUrls
            };

            delete payload.logoFile;
            delete payload.imageMainFile;
            delete payload.imagesFiles;

            // Chuyển đổi các trường dạng số
            if (payload.maxPartySize) payload.maxPartySize = Number(payload.maxPartySize);
            if (payload.bookingWindowDays) payload.bookingWindowDays = Number(payload.bookingWindowDays);
            if (payload.cancellationHours) payload.cancellationHours = Number(payload.cancellationHours);
            if (payload.depositPerPax) payload.depositPerPax = Number(payload.depositPerPax);

            mutate(payload, {
                onSuccess: () => {
                    toast.success("Tạo nhà hàng thành công!", { id: toastId });
                    onclickClose();
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Tạo nhà hàng thất bại!", { id: toastId });
                }
            });
        } catch (error: any) {
            toast.error("Có lỗi xảy ra khi xử lý hình ảnh", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <FadeIn>
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 overflow-y-auto p-4 sm:p-10">
            <div className="bg-white flex flex-col relative p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-[1000px] border border-gray-100 my-auto">
                <button onClick={onclickClose} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all" type="button">
                    <FiX className="text-xl" />
                </button>

                <div className="mb-8 border-b border-gray-100 pb-4">
                    <H variant="text_black" className="text-2xl font-bold text-gray-900">Thêm nhà hàng mới</H>
                    <P className="text-gray-500 text-sm mt-1.5">Điền thông tin bên dưới để khởi tạo nhà hàng trên hệ thống (Hỗ trợ upload ảnh)</P>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Cột 1: Thông tin cơ bản & Liên hệ */}
                        <div className="space-y-6">
                            <h3 className="text-[15px] font-bold text-indigo-600 border-b border-indigo-100 pb-2">Thông tin cơ bản</h3>
                            
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Tên nhà hàng <span className="text-red-500">*</span></label>
                                <input type="text" {...register("name")} className={`w-full px-4 py-2.5 border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} placeholder="VD: Lẩu Phan" />
                                {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Thương hiệu <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input type="text" value={brandSearch} onChange={handleSearchBrand} onFocus={() => setIsDropdownOpen(true)} className={`w-full pl-10 pr-4 py-2.5 border ${errors.brandId ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} placeholder="Tìm kiếm thương hiệu..." />
                                    <FiSearch className="absolute left-3.5 top-3 text-gray-400 text-lg" />
                                </div>
                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {isLoadingBrands ? <div className="p-4 text-center text-xs text-gray-500">Đang tìm...</div> : brands.length > 0 ? brands.map((b: any) => (
                                            <div key={b.id} onClick={() => handleSelectBrand(b.id, b.name)} className="px-4 py-2.5 hover:bg-indigo-50 cursor-pointer flex flex-col">
                                                <span className="text-[14px] font-medium text-gray-800">{b.name}</span>
                                                <span className="text-[12px] text-gray-400">ID: {b.id.substring(0, 8)}...</span>
                                            </div>
                                        )) : <div className="p-4 text-center text-xs text-gray-500">Không tìm thấy</div>}
                                    </div>
                                )}
                                {errors.brandId && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.brandId.message as string}</p>}
                                {selectedBrandId && !errors.brandId && <p className="text-[12px] text-green-600 mt-1.5 font-medium flex items-center gap-1"><FiCheck /> Đã chọn thương hiệu</p>}
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Loại nhà hàng <span className="text-red-500">*</span></label>
                                <div className={`flex flex-wrap gap-2 ${errors.categoryIds ? 'p-2 border border-red-500 bg-red-50 rounded-xl' : ''}`}>
                                    {categories.map((cat: any) => {
                                        const isSelected = watch("categoryIds")?.includes(cat.id);
                                        return (
                                            <span key={cat.id} onClick={() => toggleCategory(cat.id)} className={`px-3 py-1.5 rounded-lg text-[13px] cursor-pointer border transition-colors ${isSelected ? 'bg-green-500 border-green-600 text-white font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                                                {cat.name}
                                            </span>
                                        )
                                    })}
                                </div>
                                {errors.categoryIds && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.categoryIds.message as string}</p>}
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Mô tả</label>
                                <textarea {...register("description")} rows={3} className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px] resize-none" placeholder="Giới thiệu về nhà hàng..." />
                            </div>


                        </div>

                        {/* Cột 2: Cài đặt đặt bàn & Hình ảnh */}
                        <div className="space-y-6">
                            <h3 className="text-[15px] font-bold text-indigo-600 border-b border-indigo-100 pb-2">Cấu hình đặt bàn</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Số khách tối đa</label>
                                    <input type="number" {...register("maxPartySize")} className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Đặt trước (ngày)</label>
                                    <input type="number" {...register("bookingWindowDays")} className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Hủy trước (giờ)</label>
                                    <input type="number" {...register("cancellationHours")} className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Tiền cọc (nếu có)</label>
                                    <input type="number" {...register("depositPerPax")} className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]" placeholder="VND" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input type="checkbox" id="depositRequired" {...register("depositRequired")} className="w-4 h-4 text-indigo-600 rounded" />
                                <label htmlFor="depositRequired" className="text-[13px] text-gray-700 cursor-pointer">Bắt buộc đặt cọc</label>
                            </div>

                            <h3 className="text-[15px] font-bold text-indigo-600 border-b border-indigo-100 pb-2 mt-8">Hình ảnh</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {/* Logo */}
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Logo</label>
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden relative">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-500">Tải logo lên</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                    </label>
                                </div>
                                {/* Main Image */}
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Ảnh chính <span className="text-red-500">*</span></label>
                                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 ${errors.imageMainFile ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'} border-dashed rounded-xl cursor-pointer overflow-hidden relative`}>
                                        {mainPreview ? (
                                            <img src={mainPreview} alt="Main" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FiImage className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-500">Tải ảnh bìa</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleMainImageChange} />
                                    </label>
                                    {errors.imageMainFile && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.imageMainFile.message as string}</p>}
                                </div>
                            </div>

                            {/* Gallery */}
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Thư viện ảnh ({imagesPreview.length})</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {imagesPreview.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                            <img src={img.url} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button type="button" onClick={() => removeImage(idx)} className="p-1.5 bg-red-500 text-white rounded-md"><FiTrash2 size={14}/></button>
                                            </div>
                                        </div>
                                    ))}
                                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <FiUploadCloud className="w-6 h-6 text-gray-400" />
                                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleImagesChange} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin liên hệ full width */}
                    <div className="space-y-6">
                        <h3 className="text-[15px] font-bold text-indigo-600 border-b border-indigo-100 pb-2">Thông tin liên hệ</h3>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div className="col-span-full">
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                                <AddressSelect
                                    value={watch("address") as any}
                                    onChange={(val) => setValue("address", val as any, { shouldValidate: true })}
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.address.message as string}</p>}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                                    <input type="text" {...register("phoneContact")} className={`w-full px-4 py-2.5 border ${errors.phoneContact ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} placeholder="0912345678" />
                                    {errors.phoneContact && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phoneContact.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email liên hệ <span className="text-red-500">*</span></label>
                                    <input type="email" {...register("emailContact")} className={`w-full px-4 py-2.5 border ${errors.emailContact ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} placeholder="email@example.com" />
                                    {errors.emailContact && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.emailContact.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <Button onClick={onclickClose} variant="outline" shape="square" sizea="p3_2" type="button" className="border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl px-6 font-medium">
                            Hủy bỏ
                        </Button>
                        <Button disabled={isCreating || isUploading} variant="default" shape="square" sizea="p3_2" type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 font-medium flex items-center gap-2 shadow-md disabled:opacity-50">
                            {isUploading ? "Đang upload ảnh..." : (isCreating ? "Đang tạo..." : <><FiCheck /> Xác nhận thêm</>)}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
        </FadeIn>
    )
}

export default CreateRestaurant;
