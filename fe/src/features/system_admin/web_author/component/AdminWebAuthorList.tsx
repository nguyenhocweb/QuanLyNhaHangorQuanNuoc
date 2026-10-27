"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCrown,
  FaUsers,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaEnvelope,
  FaToggleOn,
  FaToggleOff,
  FaPhoneAlt
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";

import FadeIn from "@/src/core/components/animation/FadeIn";
import { ConfirmModal } from "@/src/core/components/layout/public-ConfirmModal";
import { useGetAdminWebAuthors } from "../hook/useGetAdminWebAuthors";
import { useUpdateAdminWebAuthor } from "../hook/useUpdateAdminWebAuthor";
import { useDeleteAdminWebAuthor } from "../hook/useDeleteAdminWebAuthor";
import { IAdminWebAuthor } from "../type/web_author_admin.type";
import { AdminWebAuthorFormModal } from "./AdminWebAuthorFormModal";

export const AdminWebAuthorList: React.FC = () => {
  const [selectedAuthor, setSelectedAuthor] = useState<IAdminWebAuthor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useGetAdminWebAuthors();
  const authors = Array.isArray(data) ? data : (data as any)?.data || [];
  const { mutate: updateAuthor } = useUpdateAdminWebAuthor();

  const { mutate: deleteAuthor, isPending: isDeleting } = useDeleteAdminWebAuthor();

  const handleOpenCreate = () => {
    setSelectedAuthor(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (author: IAdminWebAuthor) => {
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  const handleToggleActive = (author: IAdminWebAuthor) => {
    updateAuthor({
      id: author.id,
      data: { isActive: !author.isActive }
    });
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteAuthor(deletingId, {
        onSuccess: () => setDeletingId(null)
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <FadeIn className="w-full">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <FaUsers className="w-6 h-6 text-indigo-600" />
              <span>Quản Lý Đội Ngũ Phát Triển (Authors)</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Quản trị thông tin, vai trò, tech stack và thứ tự hiển thị của các kỹ sư làm web trên hệ thống.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <FaPlus className="w-3.5 h-3.5" />
            <span>Thêm Thành Viên</span>
          </button>
        </div>
      </FadeIn>

      {/* Grid of Authors */}
      <FadeIn className="w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : authors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <FaUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold text-sm">Chưa có thành viên phát triển nào.</p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
            >
              + Thêm thành viên đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <div
                key={author.id}
                className={`relative flex flex-col justify-between p-6 bg-white rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md ${
                  author.isLeader ? "border-amber-300 ring-1 ring-amber-100" : "border-gray-100"
                }`}
              >
                {/* Leader Ribbon */}
                {author.isLeader && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                    <FaCrown className="w-3 h-3 text-amber-600" />
                    <span>Leader</span>
                  </div>
                )}

                <div>
                  {/* Top: Avatar + Name + Title */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                      {author.avatarUrl ? (
                        <img
                          src={author.avatarUrl}
                          alt={author.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center">
                          {author.fullName[0]?.toUpperCase() || "A"}
                        </div>
                      )}
                    </div>

                    <div className="overflow-hidden pr-16">
                      <h3 className="font-bold text-gray-900 text-base truncate">{author.fullName}</h3>
                      <p className="text-xs text-indigo-600 font-semibold truncate">
                        {author.roleTitle || author.role}
                      </p>
                      <span className="text-[11px] text-gray-400">Thứ tự: #{author.displayOrder}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {author.bio && (
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-3">{author.bio}</p>
                  )}

                  {/* Tech Stack */}
                  {author.techStack && author.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {author.techStack.slice(0, 5).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-200"
                        >
                          {tech}
                        </span>
                      ))}
                      {author.techStack.length > 5 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 text-gray-400">
                          +{author.techStack.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                    {author.githubUrl && (
                      <a
                        href={author.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                        title="GitHub"
                      >
                        <FaGithub className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {author.linkedinUrl && (
                      <a
                        href={author.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 hover:text-sky-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="LinkedIn"
                      >
                        <FaLinkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {author.portfolioUrl && (
                      <a
                        href={author.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 hover:text-amber-500 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Portfolio"
                      >
                        <FaGlobe className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {author.hasZalo && (
                      <a
                        href={author.zaloUrl || `https://zalo.me/${(author.phone || "").replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-blue-500"
                        title="Zalo"
                      >
                        <SiZalo className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {author.phone && (
                      <a
                        href={`tel:${author.phone}`}
                        className="p-1.5 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-emerald-500"
                        title={`Gọi ${author.phone}`}
                      >
                        <FaPhoneAlt className="w-3 h-3" />
                      </a>
                    )}
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="p-1.5 hover:text-orange-500 rounded-lg hover:bg-gray-100 transition-colors"
                        title={`Email: ${author.email}`}
                      >
                        <FaEnvelope className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>


                {/* Footer Controls: Toggle Active, Edit, Delete */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                  <button
                    onClick={() => handleToggleActive(author)}
                    className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {author.isActive ? (
                      <>
                        <FaToggleOn className="w-5 h-5 text-green-500" />
                        <span className="text-green-700 font-semibold">Đang hiện</span>
                      </>
                    ) : (
                      <>
                        <FaToggleOff className="w-5 h-5 text-gray-300" />
                        <span className="text-gray-400">Đang ẩn</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(author)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      title="Chỉnh sửa"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(author.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Xóa thành viên"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </FadeIn>

      {/* Form Modal (Create/Edit) */}
      <AdminWebAuthorFormModal
        author={selectedAuthor}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAuthor(null);
        }}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        open={!!deletingId}
        title="Xóa thành viên phát triển?"
        content="Bạn có chắc chắn muốn xóa thành viên này khỏi danh sách đội ngũ phát triển không?"
        type="danger"
        isLoading={isDeleting}
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
