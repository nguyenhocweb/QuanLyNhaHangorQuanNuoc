# React Query Hooks & QueryKeys Registry

This document serves as the "React Query Agent/Knowledge Base". It tracks the core `useQuery` hooks, their `queryKey` patterns, and the data they manage.

**CRITICAL RULE FOR AI AGENTS:**
1. **BEFORE** writing a new hook or invalidating a query (via `useMutation`), you **MUST** read this registry to ensure you are using the exact matching `queryKey` pattern and avoiding duplicate hooks.
2. **AFTER** creating a new hook or `queryKey`, you **MUST** update this registry.

## 📌 System Admin

| Feature / Data Type | Hook Name | QueryKey Pattern | Returns |
| :--- | :--- | :--- | :--- |
| **Users** | `useUsersSytem` | `['users', page, limit, searchTerm, roleFilter, statusFilter, dateFilter]` | `User[]` & Meta |
| **Restaurants** | `useRestaurant_hook` | `['restaurants', page, limit, search, status, city, rating, categoryId]` | `Restaurant[]` & Meta |
| **Brands** | `useGetBrands_hook` | `['brandPage', page, limit, search]` | `Brand[]` & Meta |
| **Brand Detail** | `useGetBrandById_hook` | `['BrandDetail', id]` | `Brand` |
| **Categories** | `useCategoryRestaurant` | `['categoryRestaurant', page, limit, search, status]` | `Category_Restaurant[]` |
| **Amenities** | `useAmenity_hook` | `['Amenities', params]` | `Amenity[]` & Meta |
| **Tags** | `useTag_hook` | `['Tags', params]` | `Tag[]` & Meta |
| **Subscriptions** | `useSubscription_hook` | `['subscriptions', params]` | `Subscription[]` |
| **Payment Methods**| `usePaymentMethod_hook` | `['payment_methods']` | `PaymentMethod[]` |
| **Templates**      | `useGetTemplates`       | `['templates', type]` | `Template[]` |
| **API Keys** | `useGetApiKeys` | `['system_api_keys', params]` | `ApiKey[]` & Meta |

## 📌 Brand Owner

| Feature / Data Type | Hook Name | QueryKey Pattern | Returns |
| :--- | :--- | :--- | :--- |
| **Restaurant Detail** | `useGetRestaurantById` | `['RestaurantDetail', id_brand, id]` | `Restaurant` |
| **Menu Categories** | `useGetMenuCategories` | `['brand_menuCategories', page, limit, search]` | `MenuCategory[]` & Meta |
| **Menu Items** | `useGetMenuItems` | `['brand_menuItems', page, limit, search, categoryId]` | `MenuItem[]` & Meta |
| **Promotions** | `useGetPromotions` | `['BrandPromotions', id_brand, filters]` | `Promotion[]` & Meta |
| **Reports** | `useGetReport` | `['BrandReport', brandId, filters]` | `ReportResponse` |
| **Areas (Khu vực)** | `useArea` | `['BrandAreas', restaurantId]` | `Area[]` |
| **Tables (Bàn)** | `useTable` | `['BrandTables', areaId]` | `Table[]` |
| **Templates** | `useGetBrandTemplates_hook` | `['BrandSettingsTemplates']` | `ITemplate[]` |
| **Suppliers** | `useGetSuppliers` | `['brand-suppliers', brandId]` | `Supplier[]` |
| **Inventory Items** | `useGetInventoryItems` | `['brand-inventory-items', brandId]` | `InventoryItem[]` |

## 🌐 Public

### 1. Dành cho Khách hàng (Customer)
| Query Key | Hook sử dụng | Dữ liệu trả về | Nhóm File |
| :--- | :--- | :--- | :--- |
| `['CUSTOMER_RESERVATIONS', params]` | `useGetMyReservations` | `GetReservationsResponse` | `fe/src/features/customer/reservations/...` |
| `['CUSTOMER_ORDERS', params]` | `useGetMyOrders` | `GetMyOrdersResponse` | `fe/src/features/customer/orders/...` |
| `['CUSTOMER_INVOICES', params]` | `useGetMyInvoices` | `GetMyInvoicesResponse` | `fe/src/features/customer/invoices/...` |
| `['CUSTOMER_REVIEWS', params]` | `useGetMyReviews` | `GetMyReviewsResponse` | `fe/src/features/customer/reviews/...` |
| `['CUSTOMER_UNREVIEWED_MEALS', params]` | `useGetUnreviewedMeals` | `GetUnreviewedResponse` | `fe/src/features/customer/reviews/...` |
| **Amenities** | `useGetAllAmenities` | `['getAllAmenities']` | `Amenity[]` |
| **Restaurant Card** | `useRestaurantCard_hook` | `['restaurantCard', {page, limit, search, city, id, categoryRestaurant, review}]` | `Restaurant[]` |
| **Brand Card** | `useBrandCard_hook` | `['brandPage', {page,limit,search,city}]` | `Brand[]` |

*(Agent Note: Always expand this table when implementing new features!)*

### User / Customer Queries
- `['CUSTOMER_RESERVATIONS', { page, limit, status }]`: Fetch lịch sử đặt bàn của khách hàng.

### Customer Review
- **queryKey**: ['restaurant-reviews', restaurantId, params] - Fetch reviews for a specific restaurant.

### Brand Owner Review
- **queryKey**: ['brand-reviews', brandId, params] - Fetch all reviews for a brand.

### System Admin Review
- **queryKey**: ['system-reviews', params] - Fetch all reviews across the system.

| **Staffs (Employment)** | `useGetStaffs` | `['staffs', brandId, params]` | `IEmployment[]` & Meta |
- `['user_search', brandId, keyword]`: (Frontend) Fetch global users for assignment.

## 📌 Real-time Socket Invalidation (`useRealtimeUpdates`)
When Socket.io events (`table_updated`, `table_status_changed`, `reservation_updated`, `staff_updated`) trigger, the utility hook `useRealtimeUpdates(restaurantId)` invalidates the following queryKeys:
- **Tables & Areas**: `['areas-with-tables']`, `['TABLES']`, `['tables']`, `['BrandTables']`, `['BrandAreas']`, `['table-maintenance']`
- **Reservations**: `['RESERVATIONS']`, `['reservations']`
- **Staffs**: `['restaurant-staffs']`

### Table Maintenance Schedules
- **queryKey**: `['table-maintenance', restaurantId, params]` - Fetch table maintenance schedules for a restaurant.

### Restaurant Menu Management
- **queryKey**: `['restaurant-menu', restaurantId, params]` - Fetch menu items allocated to a restaurant branch.

### Restaurant Staff Management
- **queryKey**: `['restaurant-staffs', restaurantId, page, limit, search, salary_type]` - Fetch staff assigned to a specific restaurant branch.

### Restaurant Order Management
- **queryKey**: `['restaurant-orders', restaurantId, page, limit, status, search, dateFilter]` - Fetch orders for a specific restaurant.

### Customer Promotion & Voucher Wallet
- **queryKey**: `['CUSTOMER_VOUCHER_WALLET', page, limit, status]` - Fetch customer saved voucher wallet and statistics.
- **queryKey**: `['CUSTOMER_DISCOVER_VOUCHERS', page, limit, search, type]` - Fetch system and restaurant promotions for discovery.
- **queryKey**: `['PUBLIC_FEATURED_REVIEWS', limit]` - Fetch real 5-star customer reviews from MongoDB for the public homepage.
### Restaurant Operating Hours Management
- **queryKey**: ['manager-operating-hours'] - Fetch operating hours for the currently authenticated branch manager.

### Restaurant Manager Promotions
- **queryKey**: ['promotions', restaurantId] - Fetch promotions for a restaurant manager.
