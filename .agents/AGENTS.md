# Backend Architecture & Workflow Rules

This document outlines the strict backend architecture and workflow conventions used in this project. As an AI assistant, you MUST read and follow these rules when creating or modifying backend code.

## 1. Core Tech Stack
- **Framework**: Express.js (JavaScript).
- **ORM**: Prisma (connected to MongoDB).
- **Validation**: Zod.
- **Error Handling**: Global error handling via custom Error classes and `asyncHandler`.

## 2. Directory Structure & Key Files
- **Prisma Client**: ALWAYS import the Prisma client from `src/databases/init.mongodb.js`. 
  - *Correct*: `import { prisma } from "../../../databases/init.mongodb.js";`
  - *Incorrect*: `import prisma from "prismaClient.js";`
- **Async Handler**: Wrap all controller functions in `src/core/utils/asyncHandler.js`. Do NOT use `try...catch` blocks in controllers.
- **Custom Errors**: Import standard HTTP errors from `src/core/constants/error/index.js` (e.g., `ConflictError`, `NotFoundError`, `BadRequestError`). Throw these from the **Service** layer.
- **Validator Middleware**: Use `src/core/middlewares/validator.middleware.js` in routers to automatically validate incoming requests against Zod schemas.

## 3. Granular Module Splitting (CRITICAL)
This project follows strict **Single Responsibility Principle (SRP)** at the file level. You must NEVER combine CRUD operations into a single file (like `controller.js` or `service.js`). You must split them by operation (e.g., `create`, `get`, `update`, `delete`).

For a given module (e.g., `subscription`), the file structure MUST look exactly like this:

```text
src/modules/system_admin/subscription/
â”œâ”€â”€ controllers/
â”‚   â”œâ”€â”€ subscription.get.controller.js
â”‚   â”œâ”€â”€ subscription.create.controller.js
â”‚   â”œâ”€â”€ subscription.update.controller.js
â”‚   â””â”€â”€ subscription.delete.controller.js
â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ subscription.get.service.js
â”‚   â”œâ”€â”€ subscription.create.service.js
â”‚   â”œâ”€â”€ subscription.update.service.js
â”‚   â””â”€â”€ subscription.delete.service.js
â”œâ”€â”€ repositories/
â”‚   â”œâ”€â”€ subscription.get.repo.js
â”‚   â”œâ”€â”€ subscription.create.repo.js
â”‚   â”œâ”€â”€ subscription.update.repo.js
â”‚   â””â”€â”€ subscription.delete.repo.js
â”œâ”€â”€ validators/
â”‚   â”œâ”€â”€ subscription.create.validator.js
â”‚   â””â”€â”€ subscription.update.validator.js
â””â”€â”€ subscription.router.js
```

## 4. Layer Responsibilities & Data Flow

The strict execution flow for every request is: 
**Router -> Validator -> Controller -> Service -> Repository -> DB**.

### A. Router (`.router.js`)
- Maps HTTP methods to controllers.
- Injects middlewares (Authentication, Authorization, Validation).
- Example: 
  `route.post("/", validate(createValidator), createController.createSub);`

### B. Validator (`.validator.js`)
- Defines `zod` schemas. Usually exports an object containing a `body`, `query`, or `params` schema.
- **CRITICAL RULE**: You MUST ALWAYS read and use the predefined validation templates inside `src/core/utils/validator.js` (exported as `demoValidator`). Do not write raw Zod rules from scratch if a helper exists in `demoValidator` (e.g., `demoValidator.chuoi("TÃªn")`, `demoValidator.soDienThoai()`).

### C. Controller (`.controller.js`)
- Must ONLY be responsible for extracting data from `req` (params, query, body), calling the Service, and formatting the `res` JSON response.
- **Rule**: MUST be wrapped in `asyncHandler`.
- **Rule**: NO business logic. NO Prisma calls. NO `try...catch`.

### D. Service (`.service.js`)
- Contains all Business Logic (checking if entity exists, calculating values, formatting data for DB).
- **Rule**: MUST NOT call Prisma directly. Must call the Repository layer.
- **Rule**: Throw custom semantic errors here (e.g., `throw new ConflictError("TÃªn Ä‘Ã£ tá»“n táº¡i")`). Do not return res objects.

### E. Repository (`.repo.js`)
- Contains pure Prisma ORM calls.
- Must ONLY interact with `init.mongodb.js`.
- Keeps the Service layer decoupled from the specific ORM implementation.

---

# Frontend Architecture & Workflow Rules

This document outlines the frontend architecture and workflow conventions for the React/Next.js application.

## 1. Core Tech Stack
- **Framework**: React / Next.js (TypeScript).
- **State & Data Fetching**: `@tanstack/react-query` (React Query).
- **Forms & Validation**: `react-hook-form` with `@hookform/resolvers/zod` (Zod).
- **HTTP Client**: `axios` (wrapped in a custom `axiosClient`).
- **Styling**: TailwindCSS.

## 2. Directory Structure (Feature-Sliced Design)
The project organizes code by **Role** -> **Feature** -> **Technical Concern**. This keeps all related logic for a specific domain tightly coupled in one place instead of scattered across global folders.

For a given feature (e.g., `subscriptions` for `system_admin`), the folder structure MUST look like this:

```text
fe/src/features/system_admin/subscriptions/
â”œâ”€â”€ component/
â”‚   â”œâ”€â”€ SubscriptionsList.tsx
â”‚   â”œâ”€â”€ CreateSubscriptionForm.tsx
â”‚   â””â”€â”€ UpdateSubscriptionForm.tsx
â”œâ”€â”€ hook/
â”‚   â”œâ”€â”€ useGetSubscription.ts
â”‚   â”œâ”€â”€ useCreateSubscription.ts
â”‚   â”œâ”€â”€ useUpdateSubscription.ts
â”‚   â””â”€â”€ useDeleteSubscription.ts
â”œâ”€â”€ schema/
â”‚   â”œâ”€â”€ subscription.create.schema.ts
â”‚   â””â”€â”€ subscription.update.schema.ts
â”œâ”€â”€ service/
â”‚   â”œâ”€â”€ subscription.get.service.ts
â”‚   â”œâ”€â”€ subscription.create.service.ts
â”‚   â”œâ”€â”€ subscription.update.service.ts
â”‚   â””â”€â”€ subscription.delete.service.ts
â”œâ”€â”€ type/
â”‚   â””â”€â”€ subscription.type.ts
â””â”€â”€ constants/ (optional)
    â””â”€â”€ subscription.constant.ts
```

## 3. Layer Responsibilities & Data Flow

**CRITICAL RULE: Granular Module Splitting**
Similar to the Backend, the Frontend MUST follow the Single Responsibility Principle at the file level. You must NEVER combine CRUD operations into a single file. You must split Components, Hooks, Services, and Schemas by operation (e.g., `create`, `get`, `update`, `delete`). For example: `subscription.get.service.ts`, `useCreateSubscription.ts`, `CreateSubscriptionForm.tsx`, etc.

### A. Components (`component/`)
- Contains purely UI rendering logic.
- Must NOT contain direct API calls (`axios`).
- State management and API interactions must be imported from the `hook/` layer.
- Uses `react-hook-form` with the schema imported from `schema/`.
- **Rule**: Split components by operation (e.g., `CreateForm.tsx`, `UpdateForm.tsx`, `List.tsx`) rather than a single massive component.

### B. Hooks (`hook/`)
- Acts as the bridge between Components and Services.
- **Rule**: Use `@tanstack/react-query` (`useQuery` for fetching, `useMutation` for actions).
- **Rule**: MUST configure `staleTime: 60 * 1000` (1 minute) in `useQuery` hooks to prevent redundant API calls within 1 minute.
- **Rule**: Split hooks by operation (e.g., `useGetSubscription.ts`, `useCreateSubscription.ts`). Do NOT group multiple unrelated queries/mutations into one hook file.
- After a successful mutation, use `queryClient.invalidateQueries(...)` to refetch data automatically.
- Handle toast notifications (e.g., `react-hot-toast`) here on success/error.

### C. Services (`service/`)
- Contains raw HTTP calls.
- **Rule**: ALWAYS use `axiosClient` from `src/core/api/axios-instance.ts`. DO NOT use native `fetch` or a raw `axios` instance.
- **Rule**: Split services by operation (e.g., `subscription.get.service.ts`, `subscription.update.service.ts`).
- Example: `export const getSubscriptionService = async () => axiosClient.get('/path');`

### D. Schemas (`schema/`)
- Contains `zod` definitions for form validation and data parsing.
- **CRITICAL RULE**: You MUST ALWAYS import and use the custom predefined validation templates from `@/src/core/lib/validations.ts` (exported as `validator`). Do NOT write raw Zod rules from scratch (like `z.string()`) if a helper exists (e.g., `validator.string("TÃªn")`, `validator.email()`, `validator.phone()`).
- Export both the Zod schema and its inferred TypeScript type.
- **Rule**: Split schemas by operation if they differ significantly (e.g., `subscription.create.schema.ts`).
- Example: `export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;`

### E. Types (`type/`)
- Contains TypeScript interfaces and types for API Responses and Data Models.

## 4. UI/UX Rules
- **Feedback**: Forms must disable their submit buttons and show loading states (e.g., "Ä�ang lÆ°u...") when `isPending` is true from a React Query mutation.
- **Constants**: Avoid hardcoding large lists on the frontend. If a constant list can change, store it on the Backend and fetch it via API (e.g., Feature lists).

---

# Cloudinary Image Upload & Update Rules

This document outlines how image uploads and updates MUST be handled.

## 1. Storage Structure
Images must be stored on Cloudinary following a strict folder structure based on the database entities. The root folder is `quan_ly_nha_hang`.
- **Brands**: `quan_ly_nha_hang/brands/[brandId]/imageMain` or `logo`
- **Restaurants**: `quan_ly_nha_hang/restaurants/[restaurantId]/imageMain`, `banner`, or `gallery`
- **Users**: `quan_ly_nha_hang/user/[userId]/avatar`
- **MenuItems**: `quan_ly_nha_hang/menu_items/[restaurantId]/[itemId]/image`
- **Promotions**: `quan_ly_nha_hang/promotions/[promotionId]/banner`

## 2. Upload Flow (FE -> Cloudinary -> BE -> DB)
We use a **Signed Upload** approach. The Backend NEVER processes or temporarily stores the actual image file.
1. **Request Signature (FE)**: Frontend requests a signature from Backend (`GET /api/v1/cloudinary/image?folder=...&public_id=...`).
2. **Generate Signature (BE)**: Backend uses `cloudinary.utils.api_sign_request` and the API Secret to generate a signature and returns it to FE.
3. **Direct Upload (FE -> Cloudinary)**: Frontend sends a `POST` request directly to Cloudinary's upload API (`https://api.cloudinary.com/v1_1/{cloudName}/image/upload`) with the file, signature, timestamp, folder, and apiKey.
4. **Save URL (FE -> BE -> DB)**: Cloudinary returns a `secure_url`. Frontend includes this `secure_url` in its form payload (e.g., `logoUrl`, `imageMainUrl`) and submits it to the Backend. The Backend stores this exact string in the database.

## 3. Update Image Flow
When an image needs to be updated (e.g., replacing an existing logo or banner):
1. **Frontend Upload**: Use the exact same upload flow as above to get a new `secure_url` from Cloudinary.
   - **Important**: To overwrite an existing image cleanly (without accumulating orphaned files), you can pass the existing `public_id` when requesting the signature. Cloudinary will overwrite the old image. Otherwise, if a new public_id is generated, a new file is created on Cloudinary.
2. **Backend Update**: When calling the update endpoint (e.g., `PUT /api/v1/brands/:id`), the Frontend sends the newly received `secure_url` in the body payload.
3. **Database Saving**: The Backend Service simply updates the database record with the new URL (e.g., `prisma.brand.update({ data: { logoUrl: req.body.logoUrl } })`).

---

# UI & Animation Rules

This project places a high emphasis on a smooth and dynamic User Experience (UX).

## 1. Always Use Animations for New Components
Whenever you create a new UI component, page, or structural layout block (e.g., a card, a modal, a list, or a container), you MUST wrap it or its contents with an animation component to ensure a premium feel.
- **Animation Directory**: Always check `fe/src/core/components/animation/` for available animation wrapper components (e.g., `FadeIn.tsx`).
- **Implementation**: Wrap the main return element or significant structural sections of the new component with an appropriate animation wrapper (like `<FadeIn>...</FadeIn>`).
- **Rule**: A component is considered incomplete if it lacks entry animations. Do not generate static, lifeless UI blocks.

## 2. Leverage Advanced Custom Hooks for Premium UX
To ensure the interface feels modern, dynamic, and smooth, you MUST utilize the existing custom utility hooks in `fe/src/core/hooks/` whenever applicable:
- **`useRandomColor`**: Use this to dynamically generate beautiful, harmonious color palettes (background and text color pairs) for items like tags, badges, or categories.
- **`useDebounce`**: Always use this when dealing with search inputs or rapid state changes to prevent performance bottlenecks.
- **`useScrollSpy` & `useScrollTo`**: Use these for complex pages with navigation menus (like sidebars or table of contents) to smoothly track the user's scroll position and allow smooth scrolling to specific sections.

---

# Performance & API Optimization Rules

This document outlines the conventions for optimizing data retrieval speed and preventing single points of failure.

## 1. API Separation & Lazy Loading
- **Prevent Single Point of Failure**: NEVER bundle massive amounts of distinct relational data into a single API response (e.g., fetching a Brand along with all its Subscriptions, Restaurants, and Menu Items in one go). If one part of the query fails or takes too long, the entire page will crash or hang.
- **Split APIs**: Break down complex UI views into separate, focused APIs. For instance, a main entity API (e.g., GET /brand), a list API (e.g., GET /brand/restaurants), and a status API (e.g., GET /brand/subscription).
- **Independent Loading States**: On the Frontend, use separate useQuery hooks for each of these APIs. This allows independent loading spinners and ensures that if one section fails, the rest of the page remains functional.

## 2. Database Query Optimization
- **Specific Selects/Includes**: When querying the database (via Prisma), only select or include the exact fields needed by the frontend. Avoid arbitrary include: { relation: true } if the frontend only needs one or two fields from that relation.
- **Pagination & Limits**: Always implement pagination or limit the number of returned records for list queries (e.g., take: 10, orderBy: { createdAt: 'desc' }).

## 3. Database Schema Understanding
- **Reading Enums**: Whenever you are instructed to read or investigate a database table (model) in the Prisma schema, you MUST proactively also read the `enum.prisma` file. This ensures you fully understand the specific enum types (like statuses, roles, gender) used by that model and prevents confusion or incorrect assumptions about field values.

---

# React Query Custom Agent (Registry)

To prevent bugs related to cache invalidation and redundant API calls, a specialized registry agent has been created for React Query hooks.

## CRITICAL RULE:
1. **Always Consult the Registry**: Before writing a new `useQuery` hook, or before calling `queryClient.invalidateQueries(...)` inside a `useMutation`, you **MUST** read the `d:\DuAnCaNhan\QuanLyNhaHang\.agents\REACT_QUERY_REGISTRY.md` file to find the EXACT `queryKey` pattern and verify the expected data types.
2. **Update the Registry**: If you create a brand new hook with a new `queryKey` pattern, you **MUST** append its details into `d:\DuAnCaNhan\QuanLyNhaHang\.agents\REACT_QUERY_REGISTRY.md` so the rest of the AI agents and developers stay synchronized.

---

# Icon Library Rule

This project uses `react-icons` exclusively.

## CRITICAL RULE:
1. **Never use `lucide-react`**: Do not import or use any icons from `lucide-react`.
2. **Use `react-icons`**: Always import icons from `react-icons` (e.g., `import { FaUser } from "react-icons/fa"`, `import { BiMenu } from "react-icons/bi"`).

---

# UI/UX Designer Agent (Design Consistency Guidelines)

As the UI/UX Designer Agent, you must enforce a strict, modern, and beautiful design language across all components. Your goal is to create interfaces that are not just functional, but feel premium, cohesive, and easy to use.

## 1. Container & Card Aesthetics (Glassmorphism & Soft UI)
- **Backgrounds & Borders**: Use clean white backgrounds (`bg-white`) with subtle borders (`border border-gray-100` or `border-gray-200/50`) for cards.
- **Border Radius**: Always use rounded corners to make the UI friendly. Use `rounded-xl` for smaller elements and `rounded-2xl` for main container blocks.
- **Shadows**: Use soft shadows (`shadow-sm` or `shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]`) instead of harsh default shadows. Never use `shadow-md` or `shadow-lg` unless it's a floating dropdown/modal.

## 2. Typography & Spacing Hierarchy
- **Titles**: Use deep slate/gray for titles (`text-gray-800` or `text-slate-800`). Use `font-bold` or `font-semibold`.
- **Subtitles/Descriptions**: Use softer grays (`text-gray-500` or `text-slate-500`) for secondary text to create clear visual hierarchy.
- **Spacing**: Use consistent spacing (`p-4`, `p-6` for padding; `gap-4`, `gap-6` for flex/grid spacing). **CRITICAL**: Ensure block elements stack correctly by explicitly using `flex flex-col` if `space-y-*` does not behave as expected due to custom UI wrappers.

## 3. Interactive Elements (Buttons & Tabs)
- **Button Styling (Premium Look)**: When creating primary action buttons (like "Add New", "Save"), you MUST NOT create cramped styles. Include generous padding (`px-5 py-2.5` or `px-4 py-2`), smooth border radius (`rounded-xl` or `rounded-lg`), subtle shadow (`shadow-sm`), and a hover lift effect (`transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`). 
- **Button Icons**: When combining an icon with text in a button, prefer using `gap-2` on a `flex items-center` container instead of `mr-2` on the icon for perfect vertical/horizontal alignment.
- **Active States**: When an item (like a tab) is active, give it a distinct but elegant highlight (e.g., `bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200`).
- **Hover Effects**: All clickable elements must have a hover state (e.g., `hover:bg-gray-50`, `hover:text-gray-700`). Transition effects must be smooth (`transition-all duration-200`).
- **Icons**: Always pair icons with text in navigation/tabs to improve UX. Icons should be sized appropriately (usually `w-4 h-4` or `w-5 h-5`).

## 4. Layout & Alignment
- **Avoid Clutter**: Do not cramp elements. Give elements room to breathe.
- **Alignment**: Use `items-center` for horizontal flex layouts to ensure text and icons are perfectly vertically aligned.
- **Page Layouts**: For dashboard pages, typical layouts include a Header block (Title + Actions) and a Content block (Table/Grid), stacked vertically with `flex-col` vÃ  `w-full`.
- **Responsive & Full-Width (CRITICAL)**: Always ensure main layout blocks and their animation wrappers (like `<FadeIn>`) have `w-full` so they expand correctly on Desktop/Laptop screens. Avoid shrunk or floating UI cards in empty space by ensuring parent containers properly dictate width using `w-full` or `flex-1`.
- **Custom `<Div>` Component Rule (CRITICAL)**: The project's custom `<Div>` component defaults to `flex items-center justify-center`. This will cause all child elements to shrink and center horizontally if used in a column layout! If you need a full-width column layout, you MUST either use `vitri="col_none"` on the parent `<Div>` OR explicitly add `className="w-full"` to all child components inside it. Alternatively, use a native HTML `<div>` for simple wrappers.

## 5. Interaction Feedback (Notifications)
- **Success & Error Toasts (CRITICAL)**: Any action that modifies data (Create, Update, Delete) MUST show a clear toast notification upon success or failure. Use `sonner` (e.g., `import { toast } from "sonner"; toast.success("Cáº­p nháº­t thÃ nh cÃ´ng!")`, `toast.error("CÃ³ lá»—i xáº£y ra!")`). Do not leave the user guessing whether their action was saved.

## 6. Pagination UI (Lists & Tables)
- **Pagination Controls**: Any feature that fetches a list of items MUST implement a beautiful and smooth pagination UI at the bottom of the table/list. 
- **Information Display**: The pagination bar must show the total number of items, the current page, and the total pages (e.g., "Hiá»ƒn thá»‹ 1 Ä‘áº¿n 10 cá»§a 50 káº¿t quáº£").
- **Rows Per Page Selector**: Always include a sleek dropdown selector grouped together with the pagination buttons on the right side of the pagination bar, allowing the user to choose how many items to display per page (e.g., 10, 20, 50).
- **Interactive Buttons**: Include "Previous" (TrÆ°á»›c) and "Next" (Sau) buttons with smooth hover effects, disabled states for the first/last pages, and active page numbers. Ensure transitions are smooth (`transition-all duration-200`).

## 7. Delete Confirmation (ConfirmModal)
- **Never use window.confirm**: Any deletion action MUST use the custom <ConfirmModal> component from e/src/core/components/layout/public-ConfirmModal.tsx.
- **Implementation**: Maintain a state for the item to be deleted (e.g., const [deletingId, setDeletingId] = useState<string | null>(null)). Render the <ConfirmModal> in your component and pass open={!!deletingId}, onClose, and onConfirm props.

## 8. Form Aesthetics (Required Fields)
- **Required Indicator**: Whenever creating or updating forms, all required fields MUST visually indicate that they are mandatory using a red asterisk.
- **Implementation**: Do not use a plain black `*`. Always wrap the asterisk in a span with a red color utility class (e.g., `<span className="text-red-500">*</span>`) next to the label text.


## 9. Zod Resolver Rule
- **Type Errors**: When using `zodResolver` from `@hookform/resolvers/zod` in forms, always cast it with `as any` (e.g., `resolver: zodResolver(schema) as any`) to prevent TypeScript type mismatch errors in the IDE.

## 10. API Client & Types Rule
- **axiosClient Import**: ALWAYS import xiosClient as a default export (import axiosClient from "@/src/core/api/axios-instance";), NEVER as a named export (import { axiosClient }).
- **SuccessResponse**: The project does not have a global SuccessResponse type in frontend. When defining API response types, define them inline or explicitly (e.g., Promise<{ message: string, metadata: T }>). Do NOT import SuccessResponse.


---

# Role Names Rule

When using `authorizeRole` middleware or checking user roles, use the exact Vietnamese strings as defined in the database:
- "Admin"
- "Khách hàng"
- "Quản lý thương hiệu"
- "Quản lý nhà hàng"
- "Nhân viên"

DO NOT use 'SYSTEM', 'RESTAURANT', 'BRAND' for role checks in the application code.

---

# useDebounce & Date Formatting Rule

When using `useDebounce` hook in the frontend:
1. **Import correctly**: It is exported as a default export `import useDebounce from "@/src/core/hooks/useDebounce";` (NOT a named export).
2. **Arguments**: It takes an object, not positional arguments. Example: `const debouncedValue = useDebounce({ value: watchValue, delay: 500 });`.
3. **Date Formatting**: Do NOT import or use `date-fns` because it is not installed in the `fe` workspace. Use native JavaScript methods for date formatting (e.g., `new Date().toISOString()`, `getFullYear()`, etc.).

---

# Real Data Only Rule (No Mock/Virtual Data)

## CRITICAL RULE:
1. **Always Use Real Data**: Whenever inspecting, investigating, testing, or building components and workflows, you MUST always fetch and use REAL data from the database or API.
2. **Never Create Mock/Virtual Data**: DO NOT generate fake, virtual, or hardcoded mock data (in the database, backend, or frontend components) unless explicitly instructed by the user. Always query existing real data in the system or test against real database states.

---

# Website Brand Name Rule
- **Platform Name**: The official name of the website/platform is **NVNguyen**. 
- **CRITICAL**: Do NOT use placeholder names like "Foleat" or any other arbitrary names in the UI text, fallback data, or documentation. Always use **NVNguyen** when referring to the platform, system, or default text.

---

# Cookie & JWT Authentication Data Rule

This project uses **HttpOnly cookie-based JWT authentication**. Understanding the exact data structure is CRITICAL to avoid runtime errors.

## 1. Cookies Stored
The backend stores exactly **2 cookies** via `setCookieAccess()` and `setCookieRefresh()` from `src/core/utils/cookie.utils.js`:

| Cookie Name | Path | MaxAge | Purpose |
|---|---|---|---|
| `accessToken` | `/` (all routes) | 15 minutes | Main auth token, sent with every request |
| `refreshToken` | `/api/v1/auth/refresh/` | 3 days | Used only to refresh expired access tokens |

Both cookies are `httpOnly: true`, `sameSite: 'strict'`, `secure: true` in production.

## 2. JWT Payload (What `req.user` Contains)
When `authenticateToken` middleware decodes the JWT, `req.user` contains the following fields (plus JWT metadata like `iat`, `exp`):

```js
req.user = {
  id: "mongoObjectId",        // String - User ID
  systemRole: {               // Object - Global role (e.g., Khách hàng, Admin)
    id: "roleId",
    name: "Khách hàng" 
  },
  brand: [                    // Array - List of Brands the user has access to
    { 
      id: "brandId1", 
      name: "Brand Name", 
      isSelect: true, 
      role: "Chủ thương hiệu" 
    }
  ],
  restaurant: [               // Array - List of Restaurants the user has access to
    { 
      id: "restId1", 
      name: "Rest Name", 
      isSelect: false, 
      role: "Nhân viên" 
    }
  ],
  permissions: ["PERMISSION_NAME", ...] | null,
  iat: 1234567890,
  exp: 1234567890
}
```

## 3. Retrieving Workspace ID and Role
Because `req.user` contains arrays of workspaces, to authorize a request, the `authorizeRole` middleware expects the Frontend to pass an `x-workspace-id` in the request headers.
The middleware will then search the `req.user.brand` and `req.user.restaurant` arrays to extract the `tenantRole` for that specific workspace to ensure strict multi-tenant isolation.

---

# Multi-tenant Role Architecture (Employment)

To support users having different roles across different brands and restaurants, the project uses an `Employment` mapping table rather than storing roles directly on the `User`.

## Core Concept
- **SystemRole (Global)**: Stored in `User.systemRoleId`. Defines what the user is globally (e.g., `Admin`, `Khách hàng`). Almost all users are `Khách hàng` by default.
- **WorkspaceRole (Tenant)**: Stored in `Employment.workspaceRoleId`. Defines what the user is within a specific workspace (e.g., `Chủ thương hiệu` for Brand A, `Nhân viên` for Restaurant B).

## How it works
1. **Creation**: When adding a staff member, an `Employment` record is created linking `userId`, `brandId` (and optionally `restaurantId`), and the `workspaceRoleId`.
2. **Login Construction**: During login, `getUser` (in `User.db.js`) fetches all `employments` for the user. It constructs the `brand` and `restaurant` arrays (injected into the token) by mapping each `Employment` record to its respective workspace and extracting the `workspaceRole.name`.
3. **Authorization**: When accessing an API, the user passes `x-workspace-id`. The middleware checks the extracted `brand`/`restaurant` arrays in the JWT to verify the user's specific `tenantRole` for that exact workspace.

**CRITICAL BUG PREVENTION**: Never write fallback logic that elevates a user's local `tenantRole` based on their global `SystemRole` (unless they are explicitly `Admin`). A user could be a `Chủ thương hiệu` in Brand A, but they must remain purely a `Nhân viên` in Brand B.

---

# AI Persona Updates & Documentation Rule

If you make any updates, additions, or modifications to the tools (functions) or permissions for the AI Chatbox personas (located in `backend/src/modules/shared/llm/personas/`), you MUST immediately read and update the corresponding documentation files to keep them in sync:
1. `huong_dan/AI_Role_Permissions.md` (Update the exact list of allowed tools/limits for each role).
2. `huong_dan/AI_MicroKernel_Architecture.md` (If there are any structural changes to the architecture).
This ensures the RBAC documentation is always 100% accurate with the actual codebase.
