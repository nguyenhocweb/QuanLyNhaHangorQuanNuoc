"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAmenitySchema, UpdateAmenityFormValues } from "../schema/amenity-schema";
import { useUpdateAmenity } from "../hook/useAmenity_hook";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { IoClose } from "react-icons/io5";
import { FiLoader, FiCheckCircle, FiEdit3, FiSave } from "react-icons/fi";
import { AMENITY_ICONS, PRESET_CATEGORIES, getAmenityIcon } from "../constants/amenity_icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

const UpdateAmenityForm: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const { mutate: updateMutation, isPending } = useUpdateAmenity();
  const [activeCategory, setActiveCategory] = useState<string>(PRESET_CATEGORIES[0].category);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<UpdateAmenityFormValues>({
    resolver: zodResolver(updateAmenitySchema) as any,
    defaultValues: initialData || { name: "", description: "", icon: "" }
  });

  const selectedIcon = watch("icon") || initialData?.icon || "FaWifi";

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        icon: initialData.icon || ""
      });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: UpdateAmenityFormValues) => {
    updateMutation(
      { id: initialData.id, ...data },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  const currentIcons = PRESET_CATEGORIES.find((c) => c.category === activeCategory)?.icons || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <FadeIn className="w-full max-w-xl">
        <div className="relative w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-blue-50/30">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-200">
                <FiEdit3 />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cập nhật tiện ích</h3>
                <p className="text-xs text-gray-500 mt-0.5">Chỉnh sửa thông tin và biểu tượng hiển thị</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Tên tiện ích */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tên tiện ích <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Wifi miễn phí, Máy lạnh..."
                {...register("name")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
                  errors.name ? "border-rose-400 bg-rose-50/20" : "border-gray-200 focus:border-blue-500 bg-white"
                }`}
              />
              {errors.name && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
            </div>

            {/* Icon Picker Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Biểu tượng hiển thị (Icon)
                </label>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-mono text-blue-700">
                  <span className="text-base">{getAmenityIcon(selectedIcon, "text-blue-600")}</span>
                  <span>{selectedIcon || "Chưa chọn"}</span>
                </div>
              </div>

              {/* Category tabs */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_CATEGORIES.map((cat) => (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => setActiveCategory(cat.category)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      activeCategory === cat.category
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60"
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* Icon grid */}
              <div className="grid grid-cols-7 sm:grid-cols-8 gap-2 pt-1">
                {currentIcons.map((iconKey) => {
                  const isSelected = selectedIcon === iconKey;
                  return (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setValue("icon", iconKey, { shouldValidate: true })}
                      title={iconKey}
                      className={`w-11 h-11 flex items-center justify-center rounded-xl text-lg transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105 ring-2 ring-blue-500 ring-offset-1"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200/80 hover:border-blue-300"
                      }`}
                    >
                      {getAmenityIcon(iconKey)}
                    </button>
                  );
                })}
              </div>

              {/* Custom icon text input */}
              <div className="pt-2 border-t border-slate-200/60">
                <input
                  type="text"
                  placeholder="Hoặc nhập mã icon tuỳ chỉnh (VD: FaWifi, FaCar, FiTag)..."
                  {...register("icon")}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-mono"
                />
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mô tả chi tiết
              </label>
              <textarea
                rows={3}
                placeholder="Mô tả phạm vi hoặc tiện ích cung cấp (tùy chọn)..."
                {...register("description")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
              />
              {errors.description && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.description.message}</p>}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <FiLoader className="animate-spin text-base" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="text-base" />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </FadeIn>
    </div>
  );
};

export default UpdateAmenityForm;
