"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { templateSchema, TemplateFormValues } from "../schema/template.schema";
import { ITemplate } from "../type/template.type";
import { useCreateTemplate, useUpdateTemplate } from "../hook/useTemplate";
import { useGetSubscriptions } from "../../subscriptions/hook/useSubscription_hook";
import { FaTimes, FaSpinner, FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "sonner";
import { FiMonitor, FiTablet, FiSmartphone, FiTrash2 } from "react-icons/fi";

import FadeIn from "@/src/core/components/animation/FadeIn";
import { useUpdateCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/useUpdateCloudinary";

interface Props {
    open: boolean;
    onClose: () => void;
    template?: ITemplate | null;
}

export const TemplateFormModal = ({ open, onClose, template }: Props) => {
    const { mutate: createTemplate, isPending: isCreating } = useCreateTemplate();
    const { mutate: updateTemplate, isPending: isUpdating } = useUpdateTemplate();
    const { mutateAsync: uploadCloudinary } = useUpdateCloudinary();

    // Fetch subscriptions for allowedPlanIds
    const { data: subscriptionsData } = useGetSubscriptions();
    const plans = subscriptionsData?.data || [];

    const isPending = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<TemplateFormValues>({
        resolver: zodResolver(templateSchema) as any,
        defaultValues: {
            isActive: true,
            allowedPlanIds: [],
            type: "BRAND_TEMPLATE",
            desktopImages: [],
            tabletImages: [],
            mobileImages: [],
        }
    });

    const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

    // Cloudinary upload state
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    
    // Multi image upload states
    const [isUploadingDesktop, setIsUploadingDesktop] = useState(false);
    const [isUploadingTablet, setIsUploadingTablet] = useState(false);
    const [isUploadingMobile, setIsUploadingMobile] = useState(false);

    useEffect(() => {
        if (open) {
            if (template) {
                reset({
                    name: template.name,
                    code: template.code,
                    type: template.type,
                    thumbnailUrl: template.thumbnailUrl,
                    description: template.description,
                    isActive: template.isActive,
                    allowedPlanIds: template.allowedPlanIds || [],
                    desktopImages: template.desktopImages || [],
                    tabletImages: template.tabletImages || [],
                    mobileImages: template.mobileImages || [],
                });
                setSelectedPlans(template.allowedPlanIds || []);
            } else {
                reset({
                    name: "",
                    code: "",
                    type: "BRAND_TEMPLATE",
                    thumbnailUrl: "",
                    description: "",
                    isActive: true,
                    allowedPlanIds: [],
                    desktopImages: [],
                    tabletImages: [],
                    mobileImages: [],
                });
                setSelectedPlans([]);
            }
            setSelectedImage(null);
            setImagePreview(null);
            setUploading(false);
            setIsUploadingDesktop(false);
            setIsUploadingTablet(false);
            setIsUploadingMobile(false);
        }
    }, [open, template, reset]);

    const handlePlanToggle = (planId: string) => {
        let newPlans = [...selectedPlans];
        if (newPlans.includes(planId)) {
            newPlans = newPlans.filter(id => id !== planId);
        } else {
            newPlans.push(planId);
        }
        setSelectedPlans(newPlans);
        setValue("allowedPlanIds", newPlans, { shouldValidate: true });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            
            // Đặt tạm một giá trị để react-hook-form hiểu là trường này không còn trống
            setValue("thumbnailUrl", "ready_to_upload", { shouldValidate: true });
        }
    };

    const handleMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, device: "DESKTOP" | "TABLET" | "MOBILE") => {
        if (!e.target.files || e.target.files.length === 0) return;
        const files = Array.from(e.target.files);
        
        if (device === "DESKTOP") setIsUploadingDesktop(true);
        if (device === "TABLET") setIsUploadingTablet(true);
        if (device === "MOBILE") setIsUploadingMobile(true);
        
        const fieldName = device === "DESKTOP" ? "desktopImages" : device === "TABLET" ? "tabletImages" : "mobileImages";
        const currentImages = watch(fieldName) || [];
        
        try {
            const uploadedUrls: string[] = [];
            for (const file of files) {
                const publicId = `template_${device.toLowerCase()}_${Date.now()}_${Math.floor(Math.random()*1000)}`;
                const uploadedUrl = await uploadCloudinary({
                    folder: "/templates/preview",
                    file,
                    public_idfe: publicId
                });
                uploadedUrls.push(uploadedUrl);
            }
            
            setValue(fieldName, [...currentImages, ...uploadedUrls], { shouldValidate: true });
        } catch (error) {
            toast.error(`Có lỗi xảy ra khi tải ảnh lên cho ${device}!`);
        } finally {
            if (device === "DESKTOP") setIsUploadingDesktop(false);
            if (device === "TABLET") setIsUploadingTablet(false);
            if (device === "MOBILE") setIsUploadingMobile(false);
            e.target.value = ""; // reset input
        }
    };

    const removeImage = (device: "DESKTOP" | "TABLET" | "MOBILE", index: number) => {
        const fieldName = device === "DESKTOP" ? "desktopImages" : device === "TABLET" ? "tabletImages" : "mobileImages";
        const currentImages = watch(fieldName) || [];
        const newImages = [...currentImages];
        newImages.splice(index, 1);
        setValue(fieldName, newImages, { shouldValidate: true });
    };

    const onSubmit = async (data: TemplateFormValues) => {
        let finalThumbnailUrl = data.thumbnailUrl;

        if (selectedImage) {
            setUploading(true);
            try {
                const publicId = "template_" + Date.now();
                const uploadedUrl = await uploadCloudinary({
                    folder: "/templates",
                    file: selectedImage,
                    public_idfe: publicId
                });
                finalThumbnailUrl = uploadedUrl;
            } catch (error) {
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        const payload = { ...data, thumbnailUrl: finalThumbnailUrl };

        if (template) {
            updateTemplate(
                { id: template.id, payload },
                { onSuccess: () => onClose() }
            );
        } else {
            createTemplate(payload, { onSuccess: () => onClose() });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <FadeIn>
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800">
                            {template ? "Cập nhật Mẫu giao diện" : "Thêm Mới Mẫu Giao Diện"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        <form id="templateForm" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        Tên mẫu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("name")}
                                        className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="VD: Luxury 3D"
                                    />
                                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        Mã Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("code")}
                                        className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="VD: luxury3d"
                                        disabled={!!template}
                                    />
                                    {errors.code && <span className="text-red-500 text-xs mt-1">{errors.code.message}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        Loại giao diện <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register("type")}
                                        className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white"
                                    >
                                        <option value="BRAND_TEMPLATE">Thương hiệu (Brand)</option>
                                        <option value="RESTAURANT_TEMPLATE">Nhà hàng (Restaurant)</option>
                                    </select>
                                    {errors.type && <span className="text-red-500 text-xs mt-1">{errors.type.message}</span>}
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-semibold text-gray-700 mb-1">
                                        Trạng thái hoạt động
                                    </label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="checkbox"
                                            {...register("isActive")}
                                            className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-gray-600 text-sm">Kích hoạt</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold text-gray-700 mb-1">
                                    Ảnh Thumbnail
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative group">
                                        {(imagePreview || template?.thumbnailUrl) ? (
                                            <>
                                                <img 
                                                    src={imagePreview || template?.thumbnailUrl || ""} 
                                                    alt="Thumbnail" 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                    <FaCloudUploadAlt className="text-white text-xl" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <FaCloudUploadAlt className="text-gray-400 text-2xl mb-1" />
                                                <span className="text-[10px] text-gray-500">Tải ảnh lên</span>
                                            </>
                                        )}
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <p className="text-xs text-gray-500">
                                            Vui lòng tải lên ảnh có tỉ lệ 16:9 hoặc ảnh vuông để hiển thị tốt nhất.
                                        </p>
                                        <p className="text-xs text-gray-500 font-semibold">
                                            Định dạng: JPG, PNG. Tối đa 5MB.
                                        </p>
                                    </div>
                                </div>
                                {errors.thumbnailUrl && <span className="text-red-500 text-xs mt-1">{errors.thumbnailUrl.message}</span>}
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold text-gray-700 mb-1">
                                    Gói cước được phép sử dụng (Bỏ trống = Miễn phí)
                                </label>
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    {plans.map((plan: any) => (
                                        <div
                                            key={plan.id}
                                            onClick={() => handlePlanToggle(plan.id)}
                                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${selectedPlans.includes(plan.id)
                                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                                    : "border-gray-200 bg-white hover:border-gray-300"
                                                }`}
                                        >
                                            <input 
                                                type="checkbox"
                                                checked={selectedPlans.includes(plan.id)}
                                                readOnly
                                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                                            />
                                            <div className="flex flex-col flex-1">
                                                <span className="font-medium text-sm">{plan.name}</span>
                                                <span className="text-xs opacity-70">
                                                    {plan.price.toLocaleString()}đ / tháng
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.allowedPlanIds && <span className="text-red-500 text-xs mt-1">{errors.allowedPlanIds.message}</span>}
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold text-gray-700 mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    {...register("description")}
                                    rows={3}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                                    placeholder="Mô tả về mẫu giao diện này..."
                                />
                            </div>

                            {/* Section: Ảnh xem trước đa thiết bị */}
                            <div className="flex flex-col w-full border-t border-gray-100 pt-5">
                                <label className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    Thư viện ảnh xem trước (Preview)
                                </label>
                                <p className="text-sm text-gray-500 mb-4">
                                    Tải lên danh sách ảnh chụp giao diện cho từng loại thiết bị. Ảnh sẽ được hiển thị khi người dùng ấn "Xem trước".
                                </p>

                                <div className="flex flex-col gap-5 w-full">
                                    {/* Desktop Images */}
                                    <div className="flex flex-col w-full p-4 border border-gray-200 rounded-2xl bg-gray-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <FiMonitor className="text-indigo-500" /> Máy tính (Desktop)
                                            </h4>
                                            <div className="relative">
                                                <button type="button" disabled={isUploadingDesktop} className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50">
                                                    {isUploadingDesktop ? <><FaSpinner className="animate-spin inline mr-2" /> Đang tải lên...</> : "Tải thêm ảnh..."}
                                                </button>
                                                <input type="file" multiple accept="image/*" onChange={(e) => handleMultiImageUpload(e, "DESKTOP")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" disabled={isUploadingDesktop} />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {watch("desktopImages")?.map((url, idx) => (
                                                <div key={idx} className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm group bg-white">
                                                    <img src={url} alt={`Desktop ${idx}`} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeImage("DESKTOP", idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                                                        <FiTrash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            {(!watch("desktopImages") || watch("desktopImages")?.length === 0) && (
                                                <div className="w-full py-4 text-center text-sm text-gray-400 italic">Chưa có ảnh nào</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tablet Images */}
                                    <div className="flex flex-col w-full p-4 border border-gray-200 rounded-2xl bg-gray-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <FiTablet className="text-indigo-500" /> Máy tính bảng (Tablet)
                                            </h4>
                                            <div className="relative">
                                                <button type="button" disabled={isUploadingTablet} className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50">
                                                    {isUploadingTablet ? <><FaSpinner className="animate-spin inline mr-2" /> Đang tải lên...</> : "Tải thêm ảnh..."}
                                                </button>
                                                <input type="file" multiple accept="image/*" onChange={(e) => handleMultiImageUpload(e, "TABLET")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" disabled={isUploadingTablet} />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {watch("tabletImages")?.map((url, idx) => (
                                                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm group bg-white">
                                                    <img src={url} alt={`Tablet ${idx}`} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeImage("TABLET", idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                                                        <FiTrash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            {(!watch("tabletImages") || watch("tabletImages")?.length === 0) && (
                                                <div className="w-full py-4 text-center text-sm text-gray-400 italic">Chưa có ảnh nào</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Images */}
                                    <div className="flex flex-col w-full p-4 border border-gray-200 rounded-2xl bg-gray-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <FiSmartphone className="text-indigo-500" /> Điện thoại (Mobile)
                                            </h4>
                                            <div className="relative">
                                                <button type="button" disabled={isUploadingMobile} className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50">
                                                    {isUploadingMobile ? <><FaSpinner className="animate-spin inline mr-2" /> Đang tải lên...</> : "Tải thêm ảnh..."}
                                                </button>
                                                <input type="file" multiple accept="image/*" onChange={(e) => handleMultiImageUpload(e, "MOBILE")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" disabled={isUploadingMobile} />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {watch("mobileImages")?.map((url, idx) => (
                                                <div key={idx} className="relative w-16 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm group bg-white">
                                                    <img src={url} alt={`Mobile ${idx}`} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeImage("MOBILE", idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                                                        <FiTrash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            {(!watch("mobileImages") || watch("mobileImages")?.length === 0) && (
                                                <div className="w-full py-4 text-center text-sm text-gray-400 italic">Chưa có ảnh nào</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-all"
                            disabled={isPending}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            form="templateForm"
                            disabled={isPending || uploading}
                            className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                            {(isPending || uploading) ? <FaSpinner className="animate-spin" /> : null}
                            {template ? "Cập nhật" : "Lưu mẫu giao diện"}
                        </button>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};
