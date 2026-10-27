"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaTimes,
  FaUserCheck,
  FaPlus,
  FaCamera,
  FaTrashAlt,
  FaSpinner,
  FaPhoneAlt,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaEnvelope,
  FaFacebook,
  FaCrown,
  FaCode,
  FaLaptopCode,
  FaUser,
  FaLayerGroup,
  FaShareAlt,
  FaCog,
  FaCheckCircle,
  FaCloudUploadAlt
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { toast } from "sonner";
import FadeIn from "@/src/core/components/animation/FadeIn";
import { webAuthorSchema, WebAuthorFormValues } from "../schema/web_author.schema";
import { useCreateAdminWebAuthor } from "../hook/useCreateAdminWebAuthor";
import { useUpdateAdminWebAuthor } from "../hook/useUpdateAdminWebAuthor";
import { IAdminWebAuthor, DeveloperRole } from "../type/web_author_admin.type";
import { useUpdateCloudinary } from "@/src/features/shared/cloudinary/cloudinary_hook/useUpdateCloudinary";

interface AdminWebAuthorFormModalProps {
  author: IAdminWebAuthor | null;
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_TECH_SUGGESTIONS = [
  "Next.js",
  "React",
  "Node.js",
  "Express.js",
  "TypeScript",
  "MongoDB",
  "Prisma",
  "TailwindCSS",
  "Docker",
  "Redis",
  "Kubernetes",
  "Figma",
  "PostgreSQL",
  "AWS",
  "CI/CD",
  "WebSocket"
];

export const AdminWebAuthorFormModal: React.FC<AdminWebAuthorFormModalProps> = ({
  author,
  isOpen,
  onClose
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"GENERAL" | "TECH" | "CONTACT" | "SETTINGS">("GENERAL");
  const isEditing = !!author;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload image states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { mutateAsync: uploadCloudinary } = useUpdateCloudinary();

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<WebAuthorFormValues>({
    resolver: zodResolver(webAuthorSchema) as any,
    defaultValues: {
      fullName: "",
      roleTitle: "",
      role: "FULLSTACK_DEV",
      avatarUrl: "",
      bio: "",
      techStackText: "",
      contributionsText: "",
      githubUrl: "",
      linkedinUrl: "",
      portfolioUrl: "",
      facebookUrl: "",
      email: "",
      phone: "",
      hasZalo: false,
      zaloUrl: "",
      displayOrder: 0,
      isActive: true,
      isLeader: false
    }
  });

  // Watch form values for LIVE PREVIEW
  const fullName = watch("fullName");
  const roleTitle = watch("roleTitle");
  const role = watch("role");
  const bio = watch("bio");
  const techStackText = watch("techStackText");
  const contributionsText = watch("contributionsText");
  const isLeader = watch("isLeader");
  const isActive = watch("isActive");
  const githubUrl = watch("githubUrl");
  const linkedinUrl = watch("linkedinUrl");
  const portfolioUrl = watch("portfolioUrl");
  const facebookUrl = watch("facebookUrl");
  const email = watch("email");
  const phone = watch("phone");
  const hasZalo = watch("hasZalo");
  const zaloUrl = watch("zaloUrl");

  // Parse tech stack & contributions for preview
  const previewTechStack = techStackText
    ? techStackText.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const previewContributions = contributionsText
    ? contributionsText.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  // Tự động đồng bộ Zalo URL khi nhập số điện thoại nếu bật Zalo
  useEffect(() => {
    if (hasZalo && phone && phone.trim()) {
      const cleanPhone = phone.trim().replace(/\D/g, "");
      setValue("zaloUrl", `https://zalo.me/${cleanPhone}`);
    } else if (!hasZalo) {
      setValue("zaloUrl", "");
    }
  }, [hasZalo, phone, setValue]);

  useEffect(() => {
    if (author) {
      reset({
        fullName: author.fullName || "",
        roleTitle: author.roleTitle || "",
        role: author.role || "FULLSTACK_DEV",
        avatarUrl: author.avatarUrl || "",
        bio: author.bio || "",
        techStackText: author.techStack ? author.techStack.join(", ") : "",
        contributionsText: author.contributions ? author.contributions.join("\n") : "",
        githubUrl: author.githubUrl || "",
        linkedinUrl: author.linkedinUrl || "",
        portfolioUrl: author.portfolioUrl || "",
        facebookUrl: author.facebookUrl || "",
        email: author.email || "",
        phone: author.phone || "",
        hasZalo: author.hasZalo ?? false,
        zaloUrl: author.zaloUrl || "",
        displayOrder: author.displayOrder || 0,
        isActive: author.isActive ?? true,
        isLeader: author.isLeader ?? false
      });
      setPreviewUrl(author.avatarUrl || null);
      setSelectedFile(null);
    } else {
      reset({
        fullName: "",
        roleTitle: "",
        role: "FULLSTACK_DEV",
        avatarUrl: "",
        bio: "",
        techStackText: "",
        contributionsText: "",
        githubUrl: "",
        linkedinUrl: "",
        portfolioUrl: "",
        facebookUrl: "",
        email: "",
        phone: "",
        hasZalo: false,
        zaloUrl: "",
        displayOrder: 0,
        isActive: true,
        isLeader: false
      });
      setPreviewUrl(null);
      setSelectedFile(null);
    }
    setActiveTab("GENERAL");
  }, [author, reset, isOpen]);

  const { mutate: createAuthor, isPending: isCreating } = useCreateAdminWebAuthor(onClose);
  const { mutate: updateAuthor, isPending: isUpdating } = useUpdateAdminWebAuthor(onClose);

  const isPending = isCreating || isUpdating || isUploadingImage;

  if (!isOpen || !mounted) return null;

  // File change handler
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB!");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValue("avatarUrl", "", { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add tech stack suggestion
  const handleAddTechTag = (tag: string) => {
    const current = techStackText ? techStackText.split(",").map((s) => s.trim()).filter(Boolean) : [];
    if (!current.includes(tag)) {
      const updated = [...current, tag].join(", ");
      setValue("techStackText", updated, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: WebAuthorFormValues) => {
    try {
      let finalAvatarUrl = values.avatarUrl || null;

      if (selectedFile) {
        setIsUploadingImage(true);
        const publicId = `author_avatar_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        finalAvatarUrl = await uploadCloudinary({
          folder: "/authors/avatar",
          file: selectedFile,
          public_idfe: publicId
        });
        setIsUploadingImage(false);
      }

      const techStack = values.techStackText
        ? values.techStackText.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const contributions = values.contributionsText
        ? values.contributionsText.split("\n").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload: any = {
        fullName: values.fullName,
        roleTitle: values.roleTitle,
        role: values.role,
        avatarUrl: finalAvatarUrl,
        bio: values.bio || null,
        techStack,
        contributions,
        githubUrl: values.githubUrl || null,
        linkedinUrl: values.linkedinUrl || null,
        portfolioUrl: values.portfolioUrl || null,
        facebookUrl: values.facebookUrl || null,
        email: values.email || null,
        phone: values.phone || null,
        hasZalo: Boolean(values.hasZalo),
        zaloUrl: values.hasZalo ? values.zaloUrl || null : null,
        displayOrder: Number(values.displayOrder) || 0,
        isActive: Boolean(values.isActive),
        isLeader: Boolean(values.isLeader)
      };

      if (isEditing && author) {
        updateAuthor({ id: author.id, data: payload });
      } else {
        createAuthor(payload);
      }
    } catch (error: any) {
      setIsUploadingImage(false);
      toast.error("Có lỗi xảy ra trong quá trình tải ảnh hoặc lưu dữ liệu!");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
      <FadeIn isFirstFolder={true} className="w-full max-w-5xl my-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header Gradient */}
          <div className="flex items-center justify-between px-7 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                {isEditing ? <FaUserCheck className="w-5 h-5" /> : <FaPlus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-extrabold text-lg tracking-tight">
                  {isEditing ? "Chỉnh Sửa Hồ Sơ Kỹ Sư" : "Thêm Kỹ Sư Vào Đội Ngũ"}
                </h3>
                <p className="text-xs text-slate-300">
                  Hệ thống quản lý thông tin tác giả, tech stack và liên hệ hiển thị trên toàn hệ thống
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Body: 2 Columns (Left: Live Preview Card | Right: Tabbed Form) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* ================= LEFT COLUMN: LIVE PREVIEW (5 cols) ================= */}
            <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-y-auto">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Xem Trước Thời Gian Thực
                  </span>
                  {isLeader && (
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      👑 Leader
                    </span>
                  )}
                </div>

                {/* THE LIVE PREVIEW CARD */}
                <div
                  className={`relative flex flex-col justify-between p-6 rounded-3xl backdrop-blur-2xl border transition-all duration-300 ${
                    isLeader
                      ? "bg-gradient-to-b from-slate-900/90 via-slate-850 to-slate-900/95 border-amber-500/50 shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)]"
                      : "bg-slate-900/80 border-slate-700/60 shadow-xl"
                  }`}
                >
                  {/* Leader Crown Badge */}
                  {isLeader && (
                    <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black text-[10px] uppercase rounded-full shadow-lg">
                      <FaCrown className="w-3 h-3 text-slate-950" />
                      <span>Project Leader</span>
                    </div>
                  )}

                  <div>
                    {/* Header: Avatar + Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-md flex-shrink-0">
                        {previewUrl ? (
                          <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-slate-950">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-[14px] bg-slate-800 flex items-center justify-center text-white font-black text-xl">
                            {(fullName || "N")[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="overflow-hidden">
                        <h4 className="text-base font-extrabold text-white truncate">
                          {fullName || "Tên Thành Viên"}
                        </h4>
                        <p className="text-xs text-amber-400 font-bold tracking-wide truncate">
                          {roleTitle || "Lead Fullstack Architect"}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Vai trò: <strong className="text-slate-200">{role}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3 italic">
                      "{bio || "Tiểu sử giới thiệu kinh nghiệm chuyên môn, định hướng phát triển..."}"
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <FaCode className="w-3 h-3 text-amber-400" />
                        <span>Tech Stack</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                        {previewTechStack.length > 0 ? (
                          previewTechStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-[10px] font-semibold rounded-lg bg-slate-800 text-amber-200 border border-slate-700"
                            >
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Chưa nhập công nghệ</span>
                        )}
                      </div>
                    </div>

                    {/* Contributions */}
                    {previewContributions.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Đóng góp chính:
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {previewContributions.slice(0, 2).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-400 font-bold">•</span>
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Social & Contact Bar */}
                  <div className="flex items-center gap-2 pt-3.5 border-t border-slate-800 text-slate-400 text-xs mt-2">
                    {githubUrl && <FaGithub className="w-4 h-4 text-white hover:text-amber-400 transition-colors" />}
                    {linkedinUrl && <FaLinkedin className="w-4 h-4 text-sky-400" />}
                    {portfolioUrl && <FaGlobe className="w-4 h-4 text-amber-400" />}
                    {facebookUrl && <FaFacebook className="w-4 h-4 text-blue-400" />}
                    {hasZalo && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-md text-[10px] font-bold">
                        <SiZalo className="w-3 h-3" /> Zalo
                      </span>
                    )}
                    {phone && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-bold">
                        <FaPhoneAlt className="w-2.5 h-2.5" /> {phone}
                      </span>
                    )}
                    {email && <FaEnvelope className="w-3.5 h-3.5 text-orange-400" />}
                  </div>
                </div>
              </div>

              {/* Status Hint */}
              <div className="mt-6 pt-4 border-t border-slate-900 text-center">
                <span className="text-xs text-slate-400">
                  Trạng thái:{" "}
                  <strong className={isActive ? "text-emerald-400" : "text-slate-500"}>
                    {isActive ? "🟢 Đang hiển thị công khai" : "⚪ Đang ẩn"}
                  </strong>
                </span>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: FORM WITH TABS (7 cols) ================= */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-white overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/70 overflow-x-auto gap-1">
                {[
                  { key: "GENERAL", label: "Hồ Sơ & Ảnh", icon: FaUser },
                  { key: "TECH", label: "Kỹ Năng & Module", icon: FaLayerGroup },
                  { key: "CONTACT", label: "Liên Hệ & MXH", icon: FaShareAlt },
                  { key: "SETTINGS", label: "Cài Đặt", icon: FaCog }
                ].map((t) => {
                  const Icon = t.icon;
                  const active = activeTab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setActiveTab(t.key as any)}
                      className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? "border-indigo-600 text-indigo-600 bg-white shadow-xs"
                          : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Content Body */}
              <form
                id="author-form"
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 sm:p-7 space-y-5 overflow-y-auto flex-1 max-h-[56vh]"
              >
                {/* ================= TAB 1: GENERAL & AVATAR ================= */}
                {activeTab === "GENERAL" && (
                  <FadeIn isFirstFolder={true} className="space-y-5">
                    {/* Modern Drag & Drop Avatar Dropzone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Ảnh đại diện kỹ sư
                      </label>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer ${
                          isDragging
                            ? "border-indigo-500 bg-indigo-50/50"
                            : previewUrl
                            ? "border-emerald-300 bg-emerald-50/20"
                            : "border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-indigo-400"
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {previewUrl ? (
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md">
                              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                                <FaCheckCircle className="w-3.5 h-3.5" /> Đã chọn ảnh thành công
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">Nhấp vào đây nếu muốn chọn lại ảnh khác</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                              <FaCloudUploadAlt className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-indigo-600 hover:underline">
                                Nhấp để chọn ảnh từ máy tính
                              </span>
                              <span className="text-xs text-slate-500"> hoặc kéo thả file vào đây</span>
                              <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP (Tối đa 5MB)</p>
                            </div>
                          </>
                        )}
                      </div>

                      {previewUrl && (
                        <div className="flex justify-end mt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage();
                            }}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <FaTrashAlt className="w-3 h-3" /> Xóa ảnh này
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Full Name & Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Nguyễn Văn Nguyên"
                          {...register("fullName")}
                          className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
                        />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Chức danh hiển thị <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Lead Fullstack Architect"
                          {...register("roleTitle")}
                          className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
                        />
                        {errors.roleTitle && <p className="text-xs text-red-500 mt-1">{errors.roleTitle.message}</p>}
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Vai trò chính trong dự án <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("role")}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
                      >
                        <option value="PROJECT_LEAD">👑 PROJECT_LEAD (Trưởng dự án / Kiến trúc sư trưởng)</option>
                        <option value="FULLSTACK_DEV">⚡ FULLSTACK_DEV (Fullstack Developer)</option>
                        <option value="FRONTEND_DEV">🎨 FRONTEND_DEV (Frontend Developer)</option>
                        <option value="BACKEND_DEV">💻 BACKEND_DEV (Backend Developer)</option>
                        <option value="UI_UX_DESIGNER">✨ UI_UX_DESIGNER (UI/UX Designer)</option>
                        <option value="DEVOPS_ENGINEER">🚀 DEVOPS_ENGINEER (DevOps Engineer)</option>
                        <option value="QA_QC">🛡️ QA_QC (Kiểm thử & Đảm bảo chất lượng)</option>
                      </select>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Tiểu sử / Giới thiệu chuyên môn
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Hơn 8 năm kinh nghiệm thiết kế kiến trúc hệ thống phân tán, tối ưu hóa Cloud và phát triển giải pháp F&B toàn diện..."
                        {...register("bio")}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all leading-relaxed"
                      />
                    </div>
                  </FadeIn>
                )}

                {/* ================= TAB 2: TECH & MODULES ================= */}
                {activeTab === "TECH" && (
                  <FadeIn isFirstFolder={true} className="space-y-5">
                    {/* Tech Stack Input + Quick Suggestions */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Tech Stack (Nhập các công nghệ, ngăn cách bằng dấu phẩy)
                      </label>
                      <input
                        type="text"
                        placeholder="Next.js, Express.js, MongoDB, Prisma, TailwindCSS, Docker, Redis"
                        {...register("techStackText")}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-semibold"
                      />

                      {/* Quick Suggestions */}
                      <div className="mt-3">
                        <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                          💡 Gợi ý nhanh (Bấm để thêm vào):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {POPULAR_TECH_SUGGESTIONS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleAddTechTag(tag)}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 transition-all cursor-pointer"
                            >
                              + {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Contributions */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Module phụ trách / Đóng góp chính (Mỗi dòng một mục)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Chủ trì thiết kế kiến trúc Clean Architecture & Database Schema&#10;Xây dựng hạ tầng Real-time Ordering & Kiosk System&#10;Tối ưu hiệu năng, bảo mật và trải nghiệm đa nền tảng"
                        {...register("contributionsText")}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all leading-relaxed font-mono"
                      />
                    </div>
                  </FadeIn>
                )}

                {/* ================= TAB 3: CONTACT & SOCIAL ================= */}
                {activeTab === "CONTACT" && (
                  <FadeIn isFirstFolder={true} className="space-y-5">
                    {/* Phone & Zalo Box */}
                    <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                        <FaPhoneAlt className="w-3.5 h-3.5 text-sky-600" />
                        <span>Hotline & Kết Nối Zalo</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                          <input
                            type="text"
                            placeholder="0901234567"
                            {...register("phone")}
                            className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold"
                          />
                        </div>

                        <div className="flex flex-col justify-end">
                          <label className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 transition-colors">
                            <input
                              type="checkbox"
                              {...register("hasZalo")}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <SiZalo className="w-4 h-4 text-blue-600" />
                              Số này có dùng Zalo
                            </span>
                          </label>
                        </div>
                      </div>

                      {hasZalo && (
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Link Zalo trực tiếp
                          </label>
                          <input
                            type="text"
                            placeholder="https://zalo.me/0901234567"
                            {...register("zaloUrl")}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-blue-600"
                          />
                        </div>
                      )}
                    </div>

                    {/* Social URLs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                          <FaGithub className="w-3.5 h-3.5 text-slate-800" /> GitHub URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://github.com/username"
                          {...register("githubUrl")}
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                          <FaLinkedin className="w-3.5 h-3.5 text-sky-600" /> LinkedIn URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/in/username"
                          {...register("linkedinUrl")}
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                          <FaGlobe className="w-3.5 h-3.5 text-amber-500" /> Portfolio Website
                        </label>
                        <input
                          type="text"
                          placeholder="https://nvnguyen.dev"
                          {...register("portfolioUrl")}
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                          <FaEnvelope className="w-3.5 h-3.5 text-orange-500" /> Email liên hệ
                        </label>
                        <input
                          type="email"
                          placeholder="contact@nvnguyen.dev"
                          {...register("email")}
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                  </FadeIn>
                )}

                {/* ================= TAB 4: SETTINGS & DISPLAY ================= */}
                {activeTab === "SETTINGS" && (
                  <FadeIn isFirstFolder={true} className="space-y-5">
                    {/* Display Order */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Thứ tự ưu tiên hiển thị (Số nhỏ đứng trước)
                      </label>
                      <input
                        type="number"
                        {...register("displayOrder")}
                        className="w-full sm:w-48 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                      />
                    </div>

                    {/* Leader Toggle Box */}
                    <label className="flex items-center justify-between p-4 bg-amber-50/70 border border-amber-200 rounded-2xl cursor-pointer hover:bg-amber-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                          <FaCrown className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 block">
                            Đặt làm Trưởng Dự Án (Project Leader)
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Hiển thị huy hiệu vương miện vàng và viền hào quang phát sáng nổi bật
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        {...register("isLeader")}
                        className="w-5 h-5 text-amber-500 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
                      />
                    </label>

                    {/* Active Visibility Toggle Box */}
                    <label className="flex items-center justify-between p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                          <FaCheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 block">
                            Trạng thái Hiển thị Công khai
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Bật để hiển thị profile này trên Trang chủ và trang Đội ngũ
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        {...register("isActive")}
                        className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                      />
                    </label>
                  </FadeIn>
                )}
              </form>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between px-7 py-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Tab: <strong>{activeTab}</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    form="author-form"
                    disabled={isPending}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 cursor-pointer"
                  >
                    {isPending && <FaSpinner className="w-3.5 h-3.5 animate-spin" />}
                    <span>
                      {isUploadingImage
                        ? "Đang tải ảnh..."
                        : isCreating || isUpdating
                        ? "Đang lưu..."
                        : isEditing
                        ? "Cập Nhật Kỹ Sư"
                        : "Thêm Mới Kỹ Sư"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>,
    document.body
  );
};
