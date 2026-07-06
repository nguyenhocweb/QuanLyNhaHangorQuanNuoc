import { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { UserService } from "../service/usersSytem-service";

export const useUsers = () => {
  // 1. Quản lý State của Filters
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // 2. Tích hợp React Query
  const { data, isLoading, isFetching, isError } = useQuery({
    // queryKey: Bất cứ biến nào trong mảng này thay đổi, useQuery sẽ tự động gọi lại API
    queryKey: ['users', page, limit, searchTerm, roleFilter, statusFilter, dateFilter],
    queryFn: () => UserService.getUsers({
      page,
      limit,
      search: searchTerm || undefined,
      role: roleFilter !== "all" ? roleFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      dateFilter: dateFilter !== "all" ? dateFilter : undefined,
    }),
    // Giữ lại data của trang trước đó trong lúc fetch trang mới (UX mượt mà)
    placeholderData: keepPreviousData,
    // (Tùy chọn) Không tự fetch lại khi click sang tab khác
    refetchOnWindowFocus: false, 
  });

  // 3. Handlers
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setter(e.target.value);
    setPage(1); // Mọi thay đổi bộ lọc đều phải ép về trang 1
  };

  const handlePageChange = (newPage: number) => {
    if (data?.meta && newPage >= 1 && newPage <= data.meta.totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setDateFilter("all");
    setPage(1);
  };

  // 4. Tính toán UI Phân trang
  const meta = data?.meta;
  const startItem = useMemo(() => meta?.totalRecords === 0 ? 0 : (page - 1) * limit + 1, [page, limit, meta?.totalRecords]);
  const endItem = useMemo(() => Math.min(page * limit, meta?.totalRecords || 0), [page, limit, meta?.totalRecords]);

  return {
    // Data bóc tách từ Query
    users: data?.data || [],
    stats: data?.stats || null,
    meta: meta || { totalRecords: 0, currentPage: 1, totalPages: 1, limit: 10 },
    
    // Status
    isLoading: isLoading || isFetching,
    isError,

    // Filters & Actions
    searchTerm, setSearchTerm,
    roleFilter, setRoleFilter,
    statusFilter, setStatusFilter,
    dateFilter, setDateFilter,
    limit,
    
    handleFilterChange, handlePageChange, handleLimitChange, resetFilters,
    startItem, endItem
  };
};