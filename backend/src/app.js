import express from "express";


import morgan from "morgan"; // Ghi log request (GET /api/v1 200)
import helmet from "helmet";// Giấu thông tin server, bảo mật HTTP headers
import compression from "compression"; // Nén payload giảm dung lượng

import cors from "cors";
import corsOptions from "./core/middlewares/cors.middlewares.js";

import route from "./router/index.js";

import { errorHandler } from "./core/middlewares/error.middleware.js";
import { NotFoundError } from "./core/constants/error/index.js";
import cookieParser from "cookie-parser";



import session  from "express-session";// ✅ Phải nằm ở đây, TRƯỚC khi dùng
import {passport} from "./config/passport.config.js"
import { initCronJob } from "./jobs/index.js";

const app= express();
// --- 1. INIT MIDDLEWARES ---
app.use(morgan("dev")); // 'dev' cho ngắn gọn, 'combined' cho production
app.use(helmet());
app.use(compression());


// cho phép kết nối server
app.use(cors(corsOptions));


app.use(express.json()); // Đọc được JSON từ body


// đọc cookie

app.use(cookieParser())


/// cấu hình cấu hình Passport
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,

  })
);
app.use(passport.initialize());
app.use(passport.session());

// chạy dữ liệu ngầm db mỗi 0h 
initCronJob();
// router 
app.use("/api",route);

// --- 3. ERROR HANDLING (Xử lý lỗi) ---

// Bước 1: Bắt lỗi 404 (Không tìm thấy route)
app.use((req, res, next) => {
    const error = new NotFoundError('Not Found Route');
    next(error);
});

// Bước 2: Xử lý lỗi trung tâm (Về file error.middleware.js huyền thoại của chúng ta)
app.use(errorHandler);


export default app;