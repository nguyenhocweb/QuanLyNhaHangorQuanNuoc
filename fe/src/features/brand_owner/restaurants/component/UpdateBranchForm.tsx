"use client"
import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { Button } from "@/src/core/components/ui";
import { IoClose } from "react-icons/io5";
import { FiLoader, FiSave, FiInfo, FiMapPin, FiPhone, FiMail, FiSettings, FiEdit3, FiUploadCloud, FiImage, FiTrash2 } from "react-icons/fi";
import { branchSchema, BranchFormValues } from "../schema/branch-schema";
import { useUpdateRestaurant } from "../hook/useUpdateRestaurant";
import { useUpdateCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/useUpdateCloudinary";
import { useUploadMultipleCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/useUploadMultipleCloudinary";
import AddressSelect from "@/src/core/components/form/AddressSelect";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    id_brand: string;
    branch: any;
}

const UpdateBranchForm: React.FC<Props> = ({ isOpen, onClose, id_brand, branch }) => {
    const { mutateAsync: updateBranch, isPending: isUpdating } = useUpdateRestaurant();
    const { mutateAsync: uploadSingle } = useUpdateCloudinary();
    const { mutateAsync: uploadMultiple } = useUploadMultipleCloudinary();
    
    const [isUploading, setIsUploading] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [mainPreview, setMainPreview] = useState<string | null>(null);
    
    // Manage existing and new gallery images separately for UI
    const [existingGallery, setExistingGallery] = useState<string[]>([]);
    const [newImagesPreview, setNewImagesPreview] = useState<{url: string, file: File}[]>([]);

    const { register, handleSubmit, formState: { errors }, reset, control, setValue, watch } = useForm<BranchFormValues>({
        resolver: zodResolver(branchSchema) as any,
        defaultValues: {
            name: "",
            address: {},
            email_contact: "",
            phone_contact: "",
            description: "",
            max_party_size: 50,
            booking_window_days: 7,
            cancellation_hours: 24,
            deposit_required: false,
            deposit_amount: 0,
        }
    });

    const isDepositRequired = useWatch({ control, name: "deposit_required" });

    useEffect(() => {
        if (branch && isOpen) {
            reset({
                name: branch.name || "",
                address: branch.address || {},
                email_contact: branch.email_contact || "",
                phone_contact: branch.phone_contact || "",
                description: branch.description || "",
                max_party_size: branch.max_party_size || 50,
                booking_window_days: branch.booking_window_days || 7,
                cancellation_hours: branch.cancellation_hours || 24,
                deposit_required: branch.deposit_required || false,
                deposit_amount: branch.deposit_amount || 0,
                logo: branch.logo || "",
                imageMain: branch.imageMain || "",
                images: branch.images || [],
            });
            setLogoPreview(branch.logo || null);
            setMainPreview(branch.imageMain || null);
            setExistingGallery(branch.images || []);
            setNewImagesPreview([]);
        }
    }, [branch, isOpen, reset]);

    if (!isOpen) return null;

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
            setValue("imageMainFile", file);
            setMainPreview(URL.createObjectURL(file));
        }
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length) {
            const newPreviews = files.map(file => ({ url: URL.createObjectURL(file), file }));
            setNewImagesPreview(prev => [...prev, ...newPreviews]);
            const currentFiles = watch("imagesFiles") || [];
            setValue("imagesFiles", [...currentFiles, ...files]);
        }
    };

    const removeNewImage = (index: number) => {
        setNewImagesPreview(prev => prev.filter((_, i) => i !== index));
        const currentFiles = watch("imagesFiles") || [];
        setValue("imagesFiles", currentFiles.filter((_: any, i: number) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        const updatedExisting = existingGallery.filter((_, i) => i !== index);
        setExistingGallery(updatedExisting);
        setValue("images", updatedExisting);
    };

    const onSubmit = async (data: BranchFormValues) => {
        if (!id_brand || !branch?.id) return;

        const toastId = toast.loading("Đang cập nhật chi nhánh...");
        try {
            setIsUploading(true);
            let logoUrl = branch.logo || "";
            let mainUrl = branch.imageMain || "";
            let galleryUrls: string[] = [...existingGallery];

            const tempId = branch.id;

            if (data.logoFile) {
                toast.loading("Đang tải logo lên...", { id: toastId });
                logoUrl = await uploadSingle({ folder: `/restaurants/${tempId}/logo`, file: data.logoFile, public_idfe: "logo" });
            }

            if (data.imageMainFile) {
                toast.loading("Đang tải ảnh chính lên...", { id: toastId });
                mainUrl = await uploadSingle({ folder: `/restaurants/${tempId}/imageMain`, file: data.imageMainFile, public_idfe: "imageMain" });
            }

            if (!mainUrl) {
                toast.error("Vui lòng chọn hình ảnh chính cho chi nhánh", { id: toastId });
                setIsUploading(false);
                return;
            }

            if (data.imagesFiles && data.imagesFiles.length > 0) {
                toast.loading("Đang tải thư viện ảnh lên...", { id: toastId });
                const items = data.imagesFiles.map((file: File, index: number) => ({
                    file, public_id: `gallery_${Date.now()}_${index}`
                }));
                const newUploadedUrls = await uploadMultiple({ folder: `/restaurants/${tempId}/gallery`, items });
                galleryUrls = [...galleryUrls, ...newUploadedUrls];
            }

            toast.loading("Đang lưu thông tin chi nhánh...", { id: toastId });

            const payload: any = {
                ...data,
                logo: logoUrl || undefined,
                imageMain: mainUrl,
                images: galleryUrls
            };

            delete payload.logoFile;
            delete payload.imageMainFile;
            delete payload.imagesFiles;
            
            // Remove properties managed by BranchUtilitiesTab
            delete payload.categoryIds;
            delete payload.amenityIds;
            delete payload.tagIds;

            if (!payload.deposit_required) {
                delete payload.deposit_amount;
                payload.deposit_amount = 0;
            }

            if (payload.max_party_size) payload.max_party_size = Number(payload.max_party_size);
            if (payload.booking_window_days) payload.booking_window_days = Number(payload.booking_window_days);
            if (payload.cancellation_hours) payload.cancellation_hours = Number(payload.cancellation_hours);
            if (payload.deposit_amount) payload.deposit_amount = Number(payload.deposit_amount);

            await updateBranch({ id_brand, id: branch.id, payload });
            toast.success("Cập nhật chi nhánh thành công!", { id: toastId });
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra!", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const isBusy = isUpdating || isUploading;

    return (
        <FadeIn className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 sm:p-6">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl flex flex-col relative ring-1 ring-white/50 max-h-full">
                
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-6 flex justify-between items-center shrink-0 rounded-t-[24px]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-100/50 flex items-center justify-center shadow-sm">
                            <FiEdit3 className="text-2xl text-green-600" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Cập nhật thông tin chi nhánh</h2>
                            <p className="text-gray-500 text-sm mt-0.5 font-medium">{branch.name}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all duration-200 bg-gray-50 text-gray-500 hover:text-gray-800 hover:rotate-90"
                    >
                        <IoClose className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <form id="updateBranchForm" onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10 bg-[#FAFAFA] flex-1 overflow-y-auto custom-scrollbar">

                    {/* 1. Basic Info */}
                    <FadeIn delay={0.1} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                            <h3 className="text-lg font-bold text-gray-800 tracking-wide">Thông tin cơ bản & Hình ảnh</h3>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="group">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                    <FiEdit3 className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" /> Tên chi nhánh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("name")}
                                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-400"
                                />
                                {errors.name && <p className="text-red-500 text-xs font-medium pl-1 mt-1">{errors.name.message as string}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                    <FiInfo className="text-gray-400 transition-colors" /> Mô tả
                                </label>
                                <textarea 
                                    {...register("description")} 
                                    rows={3} 
                                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-400 resize-none" 
                                />
                            </div>

                            {/* Images */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Logo chi nhánh</label>
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-100/50 hover:border-indigo-300 transition-all overflow-hidden relative group">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-2 group-hover:scale-110 transition-transform">
                                                    <FiUploadCloud className="w-5 h-5 text-indigo-500" />
                                                </div>
                                                <p className="text-xs font-medium text-gray-500">Nhấn để thay đổi logo</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                    </label>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Ảnh chính <span className="text-red-500">*</span></label>
                                    <label className={`flex flex-col items-center justify-center w-full h-40 border-2 ${!mainPreview ? 'border-dashed border-gray-200 bg-gray-50/50' : 'border-solid border-indigo-100 bg-white'} rounded-xl cursor-pointer hover:bg-gray-100/50 hover:border-indigo-300 transition-all overflow-hidden relative group`}>
                                        {mainPreview ? (
                                            <img src={mainPreview} alt="Main" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-2 group-hover:scale-110 transition-transform">
                                                    <FiImage className="w-5 h-5 text-indigo-500" />
                                                </div>
                                                <p className="text-xs font-medium text-gray-500">Nhấn để thay đổi ảnh bìa</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleMainImageChange} />
                                    </label>
                                </div>
                            </div>

                            {/* Gallery */}
                            <div className="mt-4">
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Thư viện ảnh ({existingGallery.length + newImagesPreview.length})</label>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                    {/* Existing images from DB */}
                                    {existingGallery.map((imgUrl, idx) => (
                                        <div key={`exist-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group shadow-sm">
                                            <img src={imgUrl} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <button type="button" onClick={() => removeExistingImage(idx)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md transform hover:scale-110">
                                                    <FiTrash2 size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* New local images */}
                                    {newImagesPreview.map((img, idx) => (
                                        <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-indigo-200 group shadow-sm">
                                            <img src={img.url} className="w-full h-full object-cover opacity-80" />
                                            <div className="absolute top-1 right-1 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Mới</div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <button type="button" onClick={() => removeNewImage(idx)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md transform hover:scale-110">
                                                    <FiTrash2 size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-100/50 hover:border-indigo-300 transition-all group">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-1 group-hover:scale-110 transition-transform">
                                            <FiUploadCloud className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-500 uppercase">Thêm ảnh</span>
                                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleImagesChange} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* 2. Contact Info */}
                    <FadeIn delay={0.2} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                            <h3 className="text-lg font-bold text-gray-800 tracking-wide">Thông tin liên hệ</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div className="group">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                    <FiMapPin className="text-gray-400 group-focus-within:text-purple-500 transition-colors" /> Địa chỉ chi tiết
                                </label>
                                <AddressSelect
                                    value={watch("address") as any}
                                    onChange={(val) => setValue("address", val as any, { shouldValidate: true })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                        <FiMail className="text-gray-400 group-focus-within:text-purple-500 transition-colors" /> Email liên hệ
                                    </label>
                                    <input
                                        {...register("email_contact")}
                                        className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-400"
                                    />
                                    {errors.email_contact && <p className="text-red-500 text-xs font-medium pl-1 mt-1">{errors.email_contact.message as string}</p>}
                                </div>
                                <div className="group">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                        <FiPhone className="text-gray-400 group-focus-within:text-purple-500 transition-colors" /> Số điện thoại
                                    </label>
                                    <input
                                        {...register("phone_contact")}
                                        className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-400"
                                    />
                                    {errors.phone_contact && <p className="text-red-500 text-xs font-medium pl-1 mt-1">{errors.phone_contact.message as string}</p>}
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* 3. Advanced Settings */}
                    <FadeIn delay={0.3} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">3</div>
                                <h3 className="text-lg font-bold text-gray-800 tracking-wide">Cấu hình đặt bàn & Vận hành</h3>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors cursor-help" title="Thiết lập các quy tắc phục vụ khách hàng">
                                <FiSettings />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                            {/* Capacity */}
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-5 rounded-2xl border border-gray-200/60 flex flex-col gap-3 group">
                                <label className="text-sm font-bold text-slate-700">Sức chứa tối đa</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        {...register("max_party_size")}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 outline-none transition-all duration-300 font-bold text-lg text-slate-800 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Booking Window */}
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-5 rounded-2xl border border-gray-200/60 flex flex-col gap-3 group">
                                <label className="text-sm font-bold text-slate-700">Đặt trước (ngày)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        {...register("booking_window_days")}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 outline-none transition-all duration-300 font-bold text-lg text-slate-800 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Cancellation Window */}
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-5 rounded-2xl border border-gray-200/60 flex flex-col gap-3 group">
                                <label className="text-sm font-bold text-slate-700">Hủy trước (giờ)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        {...register("cancellation_hours")}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 outline-none transition-all duration-300 font-bold text-lg text-slate-800 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Deposit Rules */}
                        <div className={`mt-6 p-6 rounded-2xl border transition-all duration-500 flex flex-col gap-4 ${isDepositRequired ? 'bg-gradient-to-br from-orange-50/80 to-amber-50/30 border-orange-200' : 'bg-gradient-to-br from-slate-50 to-gray-50 border-gray-200/60'}`}>
                            <div className="flex items-center justify-between">
                                <label className={`text-sm font-bold cursor-pointer select-none transition-colors ${isDepositRequired ? 'text-orange-800' : 'text-slate-700'}`} htmlFor="deposit-toggle-update">
                                    Yêu cầu khách đặt cọc?
                                </label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        id="deposit-toggle-update"
                                        type="checkbox"
                                        className="sr-only peer"
                                        {...register("deposit_required")}
                                    />
                                    <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[23px] after:w-[23px] after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-amber-500 shadow-inner"></div>
                                </label>
                            </div>

                            {isDepositRequired && (
                                <FadeIn className="pt-4 border-t border-orange-200/60 space-y-3">
                                    <label className="text-sm font-bold text-orange-800 block">Số tiền cọc tối thiểu</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            {...register("deposit_amount")}
                                            className="w-full pl-5 pr-14 py-3.5 bg-white border border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all duration-300 font-bold text-xl text-orange-900 shadow-sm"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-400">VNĐ</span>
                                    </div>
                                    {errors.deposit_amount && <p className="text-red-500 text-xs font-medium pl-1">{errors.deposit_amount.message as string}</p>}
                                </FadeIn>
                            )}
                        </div>
                    </FadeIn>
                </form>

                {/* Footer Actions */}
                <div className="shrink-0 flex justify-end gap-4 px-8 py-6 bg-white border-t border-gray-100 rounded-b-[24px]">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 hover:-translate-y-0.5"
                        disabled={isBusy}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="submit"
                        form="updateBranchForm"
                        disabled={isBusy}
                        className="px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {isBusy ? <FiLoader className="animate-spin text-xl" /> : <FiSave className="text-xl" />}
                        {isUploading ? "Đang tải ảnh..." : (isUpdating ? "Đang lưu..." : "Lưu thay đổi")}
                    </Button>
                </div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e5e7eb;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #d1d5db;
                }
            `}</style>
        </FadeIn>
    );
};

export default UpdateBranchForm;
