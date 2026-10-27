"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTagSchema, CreateTagFormValues } from "../schema/tag-schema";
import { useCreateTag } from "../hook/useTag_hook";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { IoClose } from "react-icons/io5";
import { FiLoader, FiTag, FiZap, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { useRandomColor } from "@/src/core/hooks/useRandomColor";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTagForm: React.FC<Props> = ({ isOpen, onClose }) => {
  const { mutate: createMutation, isPending } = useCreateTag();
  const { getLighterColor, getDarkerColor, getRandomColorPair } = useRandomColor();

  const [isSlugManual, setIsSlugManual] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<CreateTagFormValues>({
    resolver: zodResolver(createTagSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      bgColor: "#EEF2FF",
      textColor: "#4F46E5"
    }
  });

  const name = watch("name");
  const bgColor = watch("bgColor") || "#EEF2FF";
  const textColor = watch("textColor") || "#4F46E5";

  useEffect(() => {
    if (!isSlugManual && name) {
      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [name, isSlugManual, setValue]);

  if (!isOpen) return null;

  const onSubmit = (data: CreateTagFormValues) => {
    createMutation(data, {
      onSuccess: () => {
        reset();
        setIsSlugManual(false);
        onClose();
      }
    });
  };

  const displayPreviewName = name ? name : "Thẻ xem trước";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <FadeIn className="w-full max-w-lg">
        <div className="relative w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-indigo-50/30">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-200">
                <FiTag />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Thêm thẻ (Tag) mới</h3>
                <p className="text-xs text-gray-500 mt-0.5">Tạo nhãn phân loại tìm kiếm cho nhà hàng và thực đơn</p>
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Tên thẻ */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tên thẻ (Tag) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: View đẹp, Sang trọng, Hẹn hò, Trẻ trung..."
                {...register("name")}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                  errors.name ? "border-rose-400 bg-rose-50/20" : "border-gray-200 focus:border-indigo-500 bg-white"
                }`}
              />
              {errors.name && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Đường dẫn tĩnh (Slug) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: view-dep, sang-trong..."
                {...register("slug", {
                  onChange: () => setIsSlugManual(true)
                })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                  errors.slug ? "border-rose-400 bg-rose-50/20" : "border-gray-200 focus:border-indigo-500 bg-white"
                }`}
              />
              {errors.slug && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.slug.message}</p>}
            </div>

            {/* Color section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Màu sắc hiển thị</label>
                <button
                  type="button"
                  onClick={() => {
                    const { textColor: rText, bgColor: rBg } = getRandomColorPair();
                    setValue("textColor", rText);
                    setValue("bgColor", rBg);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center gap-1.5 font-medium transition-colors px-2.5 py-1.5 rounded-lg border border-indigo-100 shadow-sm"
                  title="Tạo ngẫu nhiên một cặp màu hài hòa"
                >
                  <FiRefreshCw className="text-xs" />
                  <span>Đổi màu ngẫu nhiên</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Màu nền */}
                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-600">Màu nền</span>
                    <button
                      type="button"
                      onClick={() => setValue("bgColor", getLighterColor(textColor))}
                      className="text-[11px] text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5 font-medium"
                      title="Tạo màu nền nhạt tương phản từ màu chữ"
                    >
                      <FiZap className="text-[10px]" /> Tự tạo
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      {...register("bgColor")}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5 bg-transparent"
                    />
                    <input
                      type="text"
                      {...register("bgColor")}
                      className="w-full text-xs font-mono px-2 py-1.5 rounded-lg border border-gray-200 uppercase"
                    />
                  </div>
                </div>

                {/* Màu chữ */}
                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-600">Màu chữ</span>
                    <button
                      type="button"
                      onClick={() => setValue("textColor", getDarkerColor(bgColor))}
                      className="text-[11px] text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5 font-medium"
                      title="Tạo màu chữ đậm tương phản từ màu nền"
                    >
                      <FiZap className="text-[10px]" /> Tự tạo
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      {...register("textColor")}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5 bg-transparent"
                    />
                    <input
                      type="text"
                      {...register("textColor")}
                      className="w-full text-xs font-mono px-2 py-1.5 rounded-lg border border-gray-200 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Tag Live Preview */}
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-xs text-gray-500 block mb-2 font-medium">Bản xem trước thực tế:</span>
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-xs border"
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      borderColor: `${textColor}33`
                    }}
                  >
                    <FiTag />
                  </div>
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs border"
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      borderColor: `${textColor}40`
                    }}
                  >
                    <FiTag className="text-[11px]" />
                    <span>{displayPreviewName}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả</label>
              <textarea
                rows={2}
                placeholder="Mô tả mục đích thẻ phân loại (tùy chọn)..."
                {...register("description")}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            {/* Buttons */}
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
                    <span>Tạo thẻ</span>
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

export default CreateTagForm;
