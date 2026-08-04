"use client"; // Đừng quên dòng này nếu dùng hook của Next.js App Router
import { useSearchParams, useRouter } from "next/navigation";

type CleanKey = "all" | "search" | "city" | "page" | "limit" | "pageMenuItem" | "pageRestaurant" | "categoryRestaurant" | "review" | "filter";

export const usePagination = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- LẤY GIÁ TRỊ TỪ URL ---
  const currentPage = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 6);
  const MenuItemPage = Number(searchParams.get("pageMenuItem") || 1);
  const pageRestaurant = Number(searchParams.get("pageRestaurant") || 1);
  const searchKeyword = searchParams.get("search");
  const city = searchParams.get("city");
  const categoryRestaurant = searchParams.getAll("categoryRestaurant") || [];
  const review = Number(searchParams.get("review")) || undefined;
  const brandFilter = searchParams.get("filter") || "all";

  // --- CÁC HÀM SET ĐƠN LẺ ---
  const setBrandFilter = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filterKey === "all" || !filterKey) {
      params.delete("filter");
    } else {
      params.set("filter", filterKey);
    }
    params.set("page", "1");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const setMenuItemPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageMenuItem", String(page));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const setPageRestaurant = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageRestaurant", String(page));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const setLimit = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(newLimit));
    params.set("page", "1");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const setSearch = (newSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", newSearch);
    params.set("page", "1");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const setCity = (newCity: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("city", newCity);
    params.set("page", "1");
    router.replace(`?${params.toString()}`); // Đổi city có thể cần scroll lên đầu
  };

  // --- HÀM XÓA KEY (CLEAN) ---
  const clean = (key: CleanKey) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "all") {
      router.replace("?", { scroll: false });
      return;
    }

    params.delete(key);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // --- HÀM GỘP: ÁP DỤNG NHIỀU BỘ LỌC CÙNG LÚC ---
  const applyFiltersRestaurant = (filters: { city?: string; review?: string; categories?: string[] }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Xử lý City
    if (filters.city) {
      params.set("city", filters.city);
    } else {
      params.delete("city");
    }

    // Xử lý Review
    if (filters.review) {
      params.set("review", filters.review);
    } else {
      params.delete("review");
    }

    // Xử lý Category
    params.delete("categoryRestaurant");
    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach((c) => params.append("categoryRestaurant", c));
    }

    // Luôn reset về trang 1
    params.set("page", "1");

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // --- EXPORT MỌI THỨ RA NGOÀI ---
  return {
    // Trạng thái hiện tại
    currentPage,
    limit,
    searchKeyword,
    city,
    MenuItemPage,
    pageRestaurant,
    categoryRestaurant,
    review,
    brandFilter,
    
    // Các hàm hành động
    setPageRestaurant,
    setMenuItemPage,
    setPage,
    setLimit,
    setSearch,
    setCity,
    setBrandFilter,
    clean,
    applyFiltersRestaurant, // Đã thêm hàm này vào đây!
  };
};