# CẤU TRÚC THƯ MỤC BACKEND (BE STRUCTURE TEMPLATE)

File này quy định kiến trúc thư mục cho Backend. Dựa vào Tech Stack đã chốt ở Bước 3, Agent **BẮT BUỘC** phải chọn đúng nhánh ánh xạ ngôn ngữ bên dưới.

## 1. Tầng Nguyên Tắc Cốt Lõi (Language-Agnostic)
- **Luồng dữ liệu 1 chiều:** `Router/Endpoint -> Controller/Handler -> Service -> Repository`. Tuyệt đối cấm nhảy cóc (VD: Controller gọi thẳng DB).
- **Nguyên tắc Phân rã (SRP-theo-CRUD):** Việc tách biệt file theo từng thao tác CRUD (create, read, update, delete) là **khuyến nghị mặc định** khi ngôn ngữ/framework không có idiom mạnh hơn (như Node.js).
- **Tôn trọng Idiom Ngôn ngữ:** Đối với các ngôn ngữ có convention đặc thù (VD: Go gộp method theo struct, Python/Java gộp Service theo Entity), BẮT BUỘC áp dụng theo đúng nhánh ánh xạ bên dưới, thay vì áp dụng nguyên tắc SRP-theo-CRUD một cách cứng nhắc.

## 2. Bảng Ánh Xạ Cấu Trúc Theo Tech Stack

### Nhánh A: Node.js (Express / NestJS)
Áp dụng SRP-theo-CRUD triệt để, xé nhỏ file theo từng thao tác.
```text
src/modules/[role]/[feature]/
├── controllers/
│   ├── [feature].get.controller.js
│   ├── [feature].create.controller.js
│   └── [feature].update.controller.js
├── services/
│   ├── [feature].get.service.js
│   └── [feature].create.service.js
├── repositories/
│   └── [feature].repo.js
├── validators/
│   ├── [feature].create.validator.js
│   └── [feature].update.validator.js
└── [feature].router.js
```

### Nhánh B: Python (FastAPI / Django)
Gộp Service và Repository theo Entity để tránh phân mảnh file quá nhỏ.
```text
src/api/[version]/[feature]/
├── router.py (Định nghĩa endpoints và Depends)
├── schemas.py (Pydantic models / Validators)
├── services/
│   └── [feature]_service.py
└── crud/ (hoặc repositories)
    └── [feature]_crud.py
```

### Nhánh C: Go (Golang)
Tôn trọng idiom của Go: Gộp method theo struct trong một file.
```text
internal/[feature]/
├── handler/
│   └── http.go (Chứa các method Get, Post gắn với Handler struct)
├── service/
│   └── [feature].go (Interface và Implementation)
├── repository/
│   └── postgres.go (Database access)
└── models/
    └── [feature].go (Domain models / Structs)
```

### Nhánh D: Java (Spring Boot)
Chuẩn MVC hướng đối tượng, Interface-driven.
```text
src/main/java/com/project/[feature]/
├── controller/
│   └── [Feature]Controller.java
├── service/
│   ├── [Feature]Service.java (Interface)
│   └── impl/[Feature]ServiceImpl.java
├── repository/
│   └── [Feature]Repository.java
└── dto/
    ├── [Feature]CreateRequest.java
    └── [Feature]Response.java
```

### Nhánh E: PHP (Laravel)
Theo convention chuẩn của Laravel.
```text
app/
├── Http/
│   ├── Controllers/[Feature]Controller.php
│   └── Requests/[Feature]StoreRequest.php (Validation)
├── Services/
│   └── [Feature]Service.php
└── Repositories/
    └── [Feature]Repository.php (Tùy chọn nếu dự án lớn)
```

### Nhánh F: C# (.NET Core)
Kiến trúc Clean Architecture cơ bản.
```text
Features/[Feature]/
├── [Feature]Controller.cs
├── [Feature]Service.cs
├── I[Feature]Service.cs
├── DTOs/
│   └── [Feature]CreateDto.cs
└── [Feature]Repository.cs
```
