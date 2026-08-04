import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewCreateSchema, ReviewCreateFormValues } from '../schema/review.create.schema';
import { reviewUpdateSchema, ReviewUpdateFormValues } from '../schema/review.update.schema';
import { Review, UnreviewedMealItem } from '../type/review.type';
import { useCreateReview } from '../hook/useCreateReview';
import { useUpdateReview } from '../hook/useUpdateReview';
import { useUploadMultipleCloudinary } from '@/src/features/shared/cloudinary/cloudinary_hook/useUploadMultipleCloudinary';
import { FaStar, FaTimes, FaImage, FaSpinner, FaTrash, FaStore } from 'react-icons/fa';

interface Props {
    open: boolean;
    onClose: () => void;
    initialData?: Review | null;
    reservation?: UnreviewedMealItem | null;
}

export const ReviewFormModal: React.FC<Props> = ({ open, onClose, initialData, reservation }) => {
    const isEdit = !!initialData;
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const createMutation = useCreateReview();
    const updateMutation = useUpdateReview();
    const uploadMutation = useUploadMultipleCloudinary();

    const isPending = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

    const schema = isEdit ? reviewUpdateSchema : reviewCreateSchema;
    
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            overall_rating: 5,
            food_rating: 5,
            service_rating: 5,
            ambiance_rating: 5,
            comment: '',
            images: []
        }
    });

    const overallRating = watch('overall_rating') || 5;
    const foodRating = watch('food_rating') || 0;
    const serviceRating = watch('service_rating') || 0;
    const ambianceRating = watch('ambiance_rating') || 0;

    useEffect(() => {
        if (open) {
            if (isEdit && initialData) {
                setValue('overall_rating', initialData.overall_rating || 5);
                setValue('food_rating', initialData.food_rating || 5);
                setValue('service_rating', initialData.service_rating || 5);
                setValue('ambiance_rating', initialData.ambiance_rating || 5);
                setValue('comment', initialData.comment || '');
                setExistingImages(initialData.images || []);
                setValue('images', initialData.images || []);
            } else if (reservation) {
                reset({
                    reservationId: reservation.id,
                    overall_rating: 5,
                    food_rating: 5,
                    service_rating: 5,
                    ambiance_rating: 5,
                    comment: '',
                    images: []
                });
                setExistingImages([]);
            }
            setSelectedFiles([]);
            setPreviewUrls([]);
        }
    }, [open, isEdit, initialData, reservation, setValue, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            
            // THREAT MODELING: Giới hạn tối đa 3 ảnh (Bảo vệ ngân sách Cloudinary)
            if (existingImages.length + selectedFiles.length + files.length > 3) {
                alert("Chỉ được phép tải lên tối đa 3 hình ảnh.");
                return;
            }

            // THREAT MODELING: Giới hạn dung lượng 5MB (Chống DoS)
            const validFiles = files.filter(file => {
                if (file.size > 5 * 1024 * 1024) {
                    alert(`File ${file.name} vượt quá dung lượng 5MB.`);
                    return false;
                }
                return true;
            });

            setSelectedFiles(prev => [...prev, ...validFiles]);
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const removeNewImage = (idx: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
        setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
    };

    const removeExistingImage = (idx: number) => {
        const updated = existingImages.filter((_, i) => i !== idx);
        setExistingImages(updated);
        setValue('images', updated);
    };

    const onSubmit = async (data: any) => {
        try {
            let finalImages = [...existingImages];

            if (selectedFiles.length > 0) {
                const itemsToUpload = selectedFiles.map((file) => ({
                    file: file,
                    public_id: `review_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
                }));

                const uploadedUrls = await uploadMutation.mutateAsync({
                    items: itemsToUpload,
                    folder: '/customer/reviews'
                });

                finalImages = [...finalImages, ...uploadedUrls];
            }

            if (isEdit && initialData) {
                const payload: ReviewUpdateFormValues = {
                    overall_rating: data.overall_rating,
                    food_rating: data.food_rating,
                    service_rating: data.service_rating,
                    ambiance_rating: data.ambiance_rating,
                    comment: data.comment,
                    images: finalImages
                };
                await updateMutation.mutateAsync({ reviewId: initialData.id, data: payload });
            } else if (reservation) {
                const payload: ReviewCreateFormValues = {
                    reservationId: reservation.id,
                    overall_rating: data.overall_rating,
                    food_rating: data.food_rating,
                    service_rating: data.service_rating,
                    ambiance_rating: data.ambiance_rating,
                    comment: data.comment,
                    images: finalImages
                };
                await createMutation.mutateAsync(payload);
            }
            onClose();
        } catch (error) {
            console.error("Error submitting review form:", error);
        }
    };

    if (!open) return null;

    const restaurantName = isEdit ? (initialData?.restaurant?.name || "Nhà hàng") : (reservation?.restaurant?.name || "Nhà hàng");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col my-8 transition-all animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <FaStore className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-bold text-gray-800 text-base">
                                {isEdit ? "Chỉnh sửa đánh giá" : "Viết đánh giá món ăn & dịch vụ"}
                            </h3>
                            <span className="text-xs text-gray-500 font-medium">{restaurantName}</span>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        disabled={isPending}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
                    {/* Overall Rating */}
                    <div className="flex flex-col gap-2 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                        <label className="text-sm font-semibold text-gray-800 flex items-center justify-between">
                            <span>Đánh giá chung <span className="text-red-500">*</span></span>
                            <span className="font-bold text-amber-600 text-base">{overallRating}.0 / 5.0</span>
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setValue('overall_rating', star)}
                                    className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                                >
                                    <FaStar className={`w-7 h-7 ${star <= overallRating ? 'text-amber-400 drop-shadow-sm' : 'text-gray-200'}`} />
                                </button>
                            ))}
                        </div>
                        {errors.overall_rating && <span className="text-xs text-rose-500">{String(errors.overall_rating.message)}</span>}
                    </div>

                    {/* Detailed Ratings */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-xs font-semibold text-gray-700">Chất lượng món ăn</span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button type="button" key={star} onClick={() => setValue('food_rating', star)} className="focus:outline-none">
                                        <FaStar className={`w-4 h-4 ${star <= foodRating ? 'text-amber-400' : 'text-gray-200'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-xs font-semibold text-gray-700">Dịch vụ phục vụ</span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button type="button" key={star} onClick={() => setValue('service_rating', star)} className="focus:outline-none">
                                        <FaStar className={`w-4 h-4 ${star <= serviceRating ? 'text-amber-400' : 'text-gray-200'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-xs font-semibold text-gray-700">Không gian quán</span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button type="button" key={star} onClick={() => setValue('ambiance_rating', star)} className="focus:outline-none">
                                        <FaStar className={`w-4 h-4 ${star <= ambianceRating ? 'text-amber-400' : 'text-gray-200'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Comment Textarea */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700">Nhận xét chi tiết</label>
                        <textarea
                            {...register('comment')}
                            rows={4}
                            placeholder="Chia sẻ cảm nhận của bạn về món ăn, không gian, thái độ nhân viên phục vụ..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-800 placeholder-gray-400 resize-none transition-all"
                        />
                        {errors.comment && <span className="text-xs text-rose-500">{String(errors.comment.message)}</span>}
                    </div>

                    {/* Images upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                            <span>Hình ảnh đính kèm (Tùy chọn)</span>
                            <span className="text-gray-400 text-xs">{existingImages.length + selectedFiles.length} hình</span>
                        </label>
                        
                        <div className="flex flex-wrap gap-2.5 items-center">
                            {/* Existing Images */}
                            {existingImages.map((imgUrl, idx) => (
                                <div key={`exist-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
                                    <img src={imgUrl} alt="exist" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(idx)}
                                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaTrash className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            ))}

                            {/* New Previews */}
                            {previewUrls.map((url, idx) => (
                                <div key={`new-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-indigo-200 group">
                                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(idx)}
                                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaTrash className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            ))}

                            {/* Add Button */}
                            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-indigo-50/20 transition-all text-gray-400 hover:text-indigo-600 gap-1">
                                <FaImage className="w-5 h-5" />
                                <span className="text-[10px] font-medium">Thêm ảnh</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={isPending}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-all duration-200"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {isPending ? (
                                <>
                                    <FaSpinner className="w-3.5 h-3.5 animate-spin" />
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <span>{isEdit ? "Lưu thay đổi" : "Gửi đánh giá"}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
