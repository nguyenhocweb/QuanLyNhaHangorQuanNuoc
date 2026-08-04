"use client"
import { H, P, Button } from "@/src/core/components/ui"
import { FiX, FiCheck, FiSearch, FiUploadCloud, FiImage, FiTrash2 } from "react-icons/fi"
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateRestaurantSchema, UpdateRestaurantFormValues } from "../schema/updateRestaurant-schema"
import { useUpdateRestaurant } from "../hook/useUpdateRestaurant_hook"
import { useState, useRef, useEffect } from "react"
import { useBrandCard_hook } from "@/src/features/public/brands/hooks/useBrandCard_hook"
import { useCategoryRestaurant } from "../../categories/hook/useCategoryRestaurant_hook"
import { useUpdateCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/useUpdateCloudinary"
import { useUploadMultipleCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/useUploadMultipleCloudinary"
import { toast } from "sonner"
import useDebounce from "@/src/core/hooks/useDebounce"
import AddressSelect from "@/src/core/components/form/AddressSelect"
import { useGetRestaurantById } from "../hook/useGetRestaurantById_hook"

interface Props {
    onclickClose: () => void;
    restaurantId: string;
}

const UpdateRestaurant = ({ onclickClose, restaurantId }: Props) => {
    const { mutate, isPending: isUpdating } = useUpdateRestaurant();
    const { mutateAsync: uploadSingle } = useUpdateCloudinary();
    const { mutateAsync: uploadMultiple } = useUploadMultipleCloudinary();
    const [isUploading, setIsUploading] = useState(false);

    const { data: initialData, isLoading: isFetchingData } = useGetRestaurantById(restaurantId);
    
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

    // Trích xuất danh sách ID category đã có từ initialData
    const initialCategoryIds = initialData?.categoryIds || [];

    // Image previews
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [mainPreview, setMainPreview] = useState<string | null>(null);
    const [imagesPreview, setImagesPreview] = useState<{url: string, file: File | null}[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        reset,
        formState: { errors }
    } = useForm<UpdateRestaurantFormValues>({
        resolver: zodResolver(updateRestaurantSchema),
        defaultValues: {
            name: "", address: {}, email_contact: "", phone_contact: "", description: "",
            max_party_size: 50, booking_window_days: 7, cancellation_hours: 24, deposit_required: false, deposit_amount: 0,
            categoryIds: [], brandId: ""
        }
    });

    // Populate data when fetched
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            reset({
                name: initialData.name || "", 
                address: initialData.address || {}, 
                email_contact: initialData.email_contact || "", 
                phone_contact: initialData.phone_contact || "", 
                description: initialData.description || "",
                max_party_size: initialData.max_party_size || 50, 
                booking_window_days: initialData.booking_window_days || 7, 
                cancellation_hours: initialData.cancellation_hours || 24,
                deposit_required: initialData.deposit_required || false, 
                deposit_amount: initialData.deposit_amount || 0,
                categoryIds: initialData.categoryIds || [], 
                brandId: initialData.brandId || initialData.brand?.id || ""
            });
            setLogoPreview(initialData.logo || null);
            setMainPreview(initialData.imageMain || null);
            setImagesPreview((initialData.images || []).map((url: string) => ({ url, file: null })));
            setBrandSearch(initialData.brand?.name || "");
        }
    }, [initialData, reset]);

    const selectedBrandId = watch("brandId");

    useEffect(() => {
        if (categories.length > 0 && initialData?.categories?.length > 0) {
            const matchedIds = categories
                .filter((cat: any) => initialData.categories.some((ic: any) => ic.name === cat.name))
                .map((cat: any) => cat.id);
            
            const currentIds = getValues("categoryIds");
            if (!currentIds || currentIds.length === 0) {
                setValue("categoryIds", matchedIds);
            }
        }
    }, [categories, initialData, setValue, getValues]);

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
        }
    };

    const removeImage = (index: number) => {
        setImagesPreview(prev => prev.filter((_, i) => i !== index));
    };

    const toggleCategory = (id: string) => {
        const current = watch("categoryIds") || [];
        if (current.includes(id)) {
            setValue("categoryIds", current.filter(c => c !== id), { shouldValidate: true });
        } else {
            setValue("categoryIds", [...current, id], { shouldValidate: true });
        }
    };

    const onSubmit = async (data: UpdateRestaurantFormValues) => {
        const toastId = toast.loading("Đang chuẩn bị dữ liệu cập nhật...");
        try {
            setIsUploading(true);
            let logoUrl = initialData?.logo || "";
            let mainUrl = initialData?.imageMain || "";
            let galleryUrls: string[] = [];

            const oldGalleryUrls = imagesPreview.filter(img => !img.file).map(img => img.url);
            const newFiles = imagesPreview.filter(img => img.file).map(img => img.file as File);
            
            if (data.logoFile || data.imageMainFile || newFiles.length > 0) {
                toast.loading("Đang tải hình ảnh mới lên hệ thống...", { id: toastId });
            }

            // Upload Logo
            if (data.logoFile) {
                logoUrl = await uploadSingle({ folder: `/restaurants/${restaurantId}/logo`, file: data.logoFile, public_idfe: "logo" });
            }

            // Upload Main Image
            if (data.imageMainFile) {
                mainUrl = await uploadSingle({ folder: `/restaurants/${restaurantId}/imageMain`, file: data.imageMainFile, public_idfe: "imageMain" });
            }
            
            let uploadedNewUrls: string[] = [];
            if (newFiles.length > 0) {
                const items = newFiles.map((file, index) => ({
                    file, public_id: `gallery_${Date.now()}_${index}`
                }));
                uploadedNewUrls = await uploadMultiple({ folder: `/restaurants/${restaurantId}/gallery`, items });
            }
            
            galleryUrls = [...oldGalleryUrls, ...uploadedNewUrls];

            toast.loading("Đang lưu thông tin cập nhật...", { id: toastId });

            const payload: any = {
                id: restaurantId,
                ...data,
                logo: logoUrl,
                imageMain: mainUrl,
                images: galleryUrls
            };

            delete payload.logoFile;
            delete payload.imageMainFile;
            delete payload.imagesFiles;

            if (payload.max_party_size) payload.max_party_size = Number(payload.max_party_size);
            if (payload.booking_window_days) payload.booking_window_days = Number(payload.booking_window_days);
            if (payload.cancellation_hours) payload.cancellation_hours = Number(payload.cancellation_hours);
            if (payload.deposit_amount) payload.deposit_amount = Number(payload.deposit_amount);

            mutate(payload, {
                onSuccess: () => {
                    toast.success("Cập nhật nhà hàng thành công!", { id: toastId });
                    onclickClose();
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Cập nhật nhà hàng thất bại!", { id: toastId });
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
                
                {isFetchingData ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500 font-medium">Đang tải thông tin chi tiết...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 border-b border-gray-100 pb-4">
                            <H variant="text_black" className="text-2xl font-bold text-gray-900">Cập nhật nhà hàng</H>
                            <P className="text-gray-500 text-sm mt-1.5">Chỉnh sửa thông tin chi tiết của nhà hàng trên hệ thống</P>
                        </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Cột 1: Thông tin cơ bản & Liên hệ */}
                        <div className="space-y-6">
                            <h3 className="text-[15px] font-bold text-indigo-600 border-b border-indigo-100 pb-2">Thông tin cơ bản</h3>
                            
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Tên nhà hàng <span className="text-red-500">*</span></label>
                                <input type="text" {...register("name")} className={`w-full px-4 py-2.5 border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} placeholder="VD: Lẩu Phan" />
                                {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message as string}</p>}
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

                            <h3 className="text-[15px] font-bold text-indigo-600 border-b border-indigo-100 pb-2 mt-8">Thông tin liên hệ</h3>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <div className="col-span-full">
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                                    <AddressSelect
                                        value={watch("address") as any}
                                        onChange={(val) => setValue("address", val as any, { shouldValidate: true })}
                                    />
                                    {errors.address && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.address.message as string}</p>}
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                                    <input type="text" {...register("phone_contact")} className={`w-full px-4 py-2.5 border ${errors.phone_contact ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} placeholder="0912345678" />
                                    {errors.phone_contact && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone_contact.message}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email liên hệ <span className="text-red-500">*</span></label>
                                <input type="email" {...register("email_contact")} className={`w-full px-4 py-2.5 border ${errors.email_contact ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]`} placeholder="email@example.com" />
                                {errors.email_contact && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email_contact.message as string}</p>}
                            </div>
                        </div>

                        {/* Cột 2: Cài đặt đặt bàn & Hình ảnh */}
                        <div className="space-y-6">
                            <h3 className="text-[15px] font-bold text-indigo-600 border-b border-indigo-100 pb-2">Cấu hình đặt bàn</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Số khách tối đa</label>
                                    <input type="number" {...register("max_party_size")} className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Đặt trước (ngày)</label>
                                    <input type="number" {...register("booking_window_days")} className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Hủy trước (giờ)</label>
                                    <input type="number" {...register("cancellation_hours")} className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Tiền cọc (nếu có)</label>
                                    <input type="number" {...register("deposit_amount")} className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none text-[14px]" placeholder="VND" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input type="checkbox" id="deposit_required" {...register("deposit_required")} className="w-4 h-4 text-indigo-600 rounded" />
                                <label htmlFor="deposit_required" className="text-[13px] text-gray-700 cursor-pointer">Bắt buộc đặt cọc</label>
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

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <Button onClick={onclickClose} variant="outline" shape="square" sizea="p3_2" type="button" className="border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl px-6 font-medium">
                            Hủy bỏ
                        </Button>
                        <Button disabled={isUpdating || isUploading} variant="default" shape="square" sizea="p3_2" type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 font-medium flex items-center gap-2 shadow-md disabled:opacity-50">
                            {isUploading ? "Đang upload ảnh..." : (isUpdating ? "Đang cập nhật..." : <><FiCheck /> Lưu thay đổi</>)}
                        </Button>
                    </div>
                </form>
                </>
                )}
            </div>
        </div>
        </FadeIn>
    )
}

export default UpdateRestaurant;
