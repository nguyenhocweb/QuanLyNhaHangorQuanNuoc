"use client";

import React from "react";
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  totalItems?: number;
  onLimitChange?: (limit: number) => void;
  itemLabel?: string;
  limitOptions?: number[];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  totalItems,
  onLimitChange,
  itemLabel = "kết quả",
  limitOptions = [6, 9, 12, 18, 24, 30, 50],
}: Props) {
  const getPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 4) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 3) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = totalItems === 0 || !totalItems ? 0 : (currentPage - 1) * limit + 1;
  const endItem = totalItems ? Math.min(currentPage * limit, totalItems) : 0;

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4">
      {/* BÊN TRÁI: Chỉ hiển thị thông tin kết quả (Hiển thị X đến Y của Z kết quả) */}
      <div className="text-xs sm:text-sm font-semibold text-gray-500 flex items-center gap-1.5 flex-wrap justify-center md:justify-start">
        {totalItems !== undefined ? (
          totalItems > 0 ? (
            <>
              <span>Hiển thị</span>
              <span className="font-extrabold text-gray-800 bg-gray-100/80 px-2.5 py-0.5 rounded-lg border border-gray-200/50 shadow-2xs">
                {startItem} - {endItem}
              </span>
              <span>của</span>
              <span className="font-extrabold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200/50 shadow-2xs">
                {totalItems}
              </span>
              <span>{itemLabel}</span>
            </>
          ) : (
            <span className="text-gray-400 font-medium">Không có {itemLabel} nào để hiển thị</span>
          )
        ) : (
          <span>Trang <strong className="text-gray-800">{currentPage}</strong> / <strong className="text-gray-800">{totalPages || 1}</strong></span>
        )}
      </div>

      {/* BÊN PHẢI: Nhóm [Bộ chọn số lượng hiển thị] nằm TRƯỚC [Các nút chuyển trang] */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {/* 1. Rows Per Page Selector (Nằm TRƯỚC các nút chuyển trang) */}
        {onLimitChange && (
          <div className="flex items-center gap-2 border-r border-gray-200/80 pr-3 sm:pr-4">
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider hidden sm:inline">
              Hiển thị:
            </span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              aria-label="Chọn số lượng hiển thị trên trang"
              className="bg-white border border-gray-200/80 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-gray-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer hover:border-gray-300"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / trang
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 2. Page Navigation Buttons (Nằm SAU bộ chọn số lượng) */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <button
            type="button"
            disabled={currentPage <= 1 || totalPages === 0}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-2 rounded-xl border border-gray-200/80 bg-white text-gray-700 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 hover:shadow-xs hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none disabled:hover:translate-y-0 cursor-pointer"
            title="Trang trước"
          >
            <FaAngleDoubleLeft className="text-xs text-purple-600" />
            <span className="hidden sm:inline">Trước</span>
          </button>

          {getPages().map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="w-7 h-9 flex items-center justify-center text-gray-400 font-bold select-none text-xs"
              >
                ...
              </span>
            ) : (
              <button
                key={`page-${p}-${i}`}
                type="button"
                onClick={() => onPageChange(Number(p))}
                className={`min-w-[36px] h-9 px-3 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  currentPage === p
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 scale-105 pointer-events-none"
                    : "border border-gray-200/80 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-2xs hover:-translate-y-0.5"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-2 rounded-xl border border-gray-200/80 bg-white text-gray-700 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 hover:shadow-xs hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none disabled:hover:translate-y-0 cursor-pointer"
            title="Trang sau"
          >
            <span className="hidden sm:inline">Sau</span>
            <FaAngleDoubleRight className="text-xs text-purple-600" />
          </button>
        </div>
      </div>
    </div>
  );
}