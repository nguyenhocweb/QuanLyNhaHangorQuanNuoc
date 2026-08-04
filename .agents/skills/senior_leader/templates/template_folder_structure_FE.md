# CẤU TRÚC THƯ MỤC FRONTEND (FE STRUCTURE TEMPLATE)

File này quy định kiến trúc thư mục cho Frontend. Dựa vào Tech Stack đã chốt ở Bước 3, Agent **BẮT BUỘC** phải chọn đúng nhánh ánh xạ framework bên dưới.

## 1. Tầng Nguyên Tắc Cốt Lõi (Framework-Agnostic)
Dự án áp dụng kiến trúc **Feature-Sliced Design**. Mã nguồn được tổ chức theo `Role -> Feature -> Technical Concern`.
- **Tách bạch UI và Logic:** Component chỉ để render. Mọi logic gọi API, quản lý state phức tạp phải được đẩy ra một lớp trung gian (Hook/Composable/Service).
- **Service Layer riêng biệt:** Gọi API qua custom HTTP Client (Axios/Fetch wrapper), cấm gọi trực tiếp trong UI.
- **Data Validation:** Validate form/dữ liệu bằng schema (Zod/Yup) thay vì if/else thủ công. Đảm bảo mức độ xé nhỏ schema tương đồng với BE Validator.

## 2. Bảng Ánh Xạ Cấu Trúc Theo Tech Stack

### Nhánh A: React (Next.js / Vite)
Sử dụng Custom Hooks và React Query.
```text
src/features/[role]/[feature]/
├── components/
│   ├── [Feature]List.tsx
│   └── Create[Feature]Form.tsx
├── hooks/
│   ├── useGet[Feature].ts
│   └── useCreate[Feature].ts (React Query mutation)
├── schemas/
│   ├── [feature].create.schema.ts (Tách Schema tương tự Validator ở BE Node.js)
│   └── [feature].update.schema.ts
├── services/
│   └── [feature].service.ts (Axios calls)
└── types/
    └── [feature].type.ts
```

### Nhánh B: Vue 3 (Nuxt / Vite)
Sử dụng Composables và VueUse.
```text
src/features/[role]/[feature]/
├── components/
│   ├── [Feature]List.vue
│   └── Create[Feature]Form.vue
├── composables/
│   ├── use[Feature].ts (Tương đương custom hook, dùng ref/reactive)
├── schemas/
│   ├── [feature].create.schema.ts (VeeValidate/Zod)
│   └── [feature].update.schema.ts
├── services/
│   └── [feature].service.ts (HTTP calls)
└── types/
    └── [feature].type.ts
```

### Nhánh C: Angular
Sử dụng Dependency Injection và RxJS.
```text
src/app/features/[role]/[feature]/
├── components/
│   ├── [feature]-list/
│   │   ├── [feature]-list.component.ts
│   │   ├── [feature]-list.component.html
│   │   └── [feature]-list.component.scss
├── services/
│   └── [feature].service.ts (HTTP calls + State management via RxJS)
└── models/
    └── [feature].model.ts (Interfaces / Form Validation Logic)
```
