"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAmenitySchema, CreateAmenityFormValues } from "../schema/amenity-schema";
import { useCreateAmenity } from "../hook/useAmenity_hook";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { IoClose } from "react-icons/io5";
import { FiLoader, FiCheckCircle, FiTag, FiFileText } from "react-icons/fi";
import { AMENITY_ICONS, PRESET_CATEGORIES, getAmenityIcon } from "../constants/amenity_icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAmenityForm: React.FC<Props> = ({ isOpen, onClose }) => {
  const { mutate: createMutation, isPending } = useCreateAmenity();
  const [activeCategory, setActiveCategory] = useState<string>(PRESET_CATEGORIES[0].category);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<CreateAmenityFormValues>({
    resolver: zodResolver(createAmenitySchema) as any,
    defaultValues: { name: "", description: "", icon: "FaWifi" }
  });

  const selectedIcon = watch("icon") || "FaWifi";

  if (!isOpen) return null;

  const onSubmit = (data: CreateAmenityFormValues) => {
    createMutation(data, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  const currentIcons = PRESET_CATEGORIES.find((c) => c.category === activeCategory)?.icons || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <FadeIn className="w-full max-w-xl">
        <div className="relative w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-indigo-50/30">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-200">
                <FiTag />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Thêm tiện ích mới</h3>
                <p className="text-xs text-gray-500 mt-0.5">Tạo tiện ích tiêu chuẩn cho các thương hiệu và nhà hàng</p>
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
                placeholder="VD: Wifi tốc độ cao, Bãi đỗ xe ô tô, Phòng VIP..."
                {...register("name")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                  errors.name ? "border-rose-400 bg-rose-50/20" : "border-gray-200 focus:border-indigo-500 bg-white"
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
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-mono text-indigo-700">
                  <span className="text-base">{getAmenityIcon(selectedIcon, "text-indigo-600")}</span>
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
                        ? "bg-indigo-600 text-white shadow-sm"
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
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105 ring-2 ring-indigo-500 ring-offset-1"
                          : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200/80 hover:border-indigo-300"
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
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 font-mono"
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
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <FiLoader className="animate-spin text-base" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="text-base" />
                    <span>Tạo tiện ích</span>
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

export default CreateAmenityForm;
