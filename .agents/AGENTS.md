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
├── controllers/
│   ├── subscription.get.controller.js
│   ├── subscription.create.controller.js
│   ├── subscription.update.controller.js
│   └── subscription.delete.controller.js
├── services/
│   ├── subscription.get.service.js
│   ├── subscription.create.service.js
│   ├── subscription.update.service.js
│   └── subscription.delete.service.js
├── repositories/
│   ├── subscription.get.repo.js
│   ├── subscription.create.repo.js
│   ├── subscription.update.repo.js
│   └── subscription.delete.repo.js
├── validators/
│   ├── subscription.create.validator.js
│   └── subscription.update.validator.js
└── subscription.router.js
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
- Uses `demoValidator` from `src/core/utils/validator.js` when appropriate.

### C. Controller (`.controller.js`)
- Must ONLY be responsible for extracting data from `req` (params, query, body), calling the Service, and formatting the `res` JSON response.
- **Rule**: MUST be wrapped in `asyncHandler`.
- **Rule**: NO business logic. NO Prisma calls. NO `try...catch`.

### D. Service (`.service.js`)
- Contains all Business Logic (checking if entity exists, calculating values, formatting data for DB).
- **Rule**: MUST NOT call Prisma directly. Must call the Repository layer.
- **Rule**: Throw custom semantic errors here (e.g., `throw new ConflictError("Tên đã tồn tại")`). Do not return res objects.

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
├── component/
│   ├── SubscriptionsList.tsx
│   ├── CreateSubscriptionForm.tsx
│   └── UpdateSubscriptionForm.tsx
├── hook/
│   └── useSubscription_hook.ts
├── schema/
│   └── subscription-schema.ts
├── service/
│   └── subscription_service.ts
├── type/
│   └── subscription.type.ts
└── constants/ (optional)
    └── subscription.constant.ts
```

## 3. Layer Responsibilities & Data Flow

### A. Components (`component/`)
- Contains purely UI rendering logic.
- Must NOT contain direct API calls (`axios`).
- State management and API interactions must be imported from the `hook/` layer.
- Uses `react-hook-form` with the schema imported from `schema/`.

### B. Hooks (`hook/`)
- Acts as the bridge between Components and Services.
- **Rule**: Use `@tanstack/react-query` (`useQuery` for fetching, `useMutation` for actions).
- **Rule**: MUST configure `staleTime: 60 * 1000` (1 minute) in `useQuery` hooks to prevent redundant API calls within 1 minute.
- After a successful mutation, use `queryClient.invalidateQueries(...)` to refetch data automatically.
- Handle toast notifications (e.g., `react-hot-toast`) here on success/error.

### C. Services (`service/`)
- Contains raw HTTP calls.
- **Rule**: ALWAYS use `axiosClient` from `src/core/api/axios-instance.ts`. DO NOT use native `fetch` or a raw `axios` instance.
- Example: `export const getSubscriptionService = async () => axiosClient.get('/path');`

### D. Schemas (`schema/`)
- Contains `zod` definitions for form validation and data parsing.
- Export both the Zod schema and its inferred TypeScript type.
- Example: `export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;`

### E. Types (`type/`)
- Contains TypeScript interfaces and types for API Responses and Data Models.

## 4. UI/UX Rules
- **Feedback**: Forms must disable their submit buttons and show loading states (e.g., "Đang lưu...") when `isPending` is true from a React Query mutation.
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
