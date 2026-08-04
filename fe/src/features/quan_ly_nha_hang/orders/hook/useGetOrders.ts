import { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { orderGetService } from "../service/order.get.service";

export const useGetOrders = (restaurantId: string | null) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("today");

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['restaurant-orders', restaurantId, page, limit, statusFilter, searchTerm, dateFilter],
    queryFn: () => orderGetService.getOrders({
      page,
      limit,
      search: searchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      dateFilter: dateFilter !== "all" ? dateFilter : undefined,
    }),
    placeholderData: keepPreviousData,
    enabled: !!restaurantId,
  });

  const handlePageChange = (newPage: number) => {
    if (data?.meta && newPage >= 1 && newPage <= data.meta.totalPages) {
      setPage(newPage);
    }
  };

  const meta = data?.meta;
  const startItem = useMemo(() => meta?.totalRecords === 0 ? 0 : (page - 1) * limit + 1, [page, limit, meta?.totalRecords]);
  const endItem = useMemo(() => Math.min(page * limit, meta?.totalRecords || 0), [page, limit, meta?.totalRecords]);

  return {
    orders: data?.data || [],
    meta: meta || { totalRecords: 0, currentPage: 1, totalPages: 1, limit: 10 },
    isLoading: isLoading || isFetching,
    isError,
    
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    dateFilter, setDateFilter,
    limit, setLimit,
    
    handlePageChange,
    startItem, endItem, page, setPage
  };
};
