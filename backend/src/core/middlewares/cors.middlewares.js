import { appConfig } from "../../config/app.config.js";// src/config/cors.config.ts


const allowedOrigins = appConfig.url_client?.split(',') || [];

 const corsOptions = {
  // 1. Dynamic Origin Check (Quan trọng nhất)
  origin: (origin, callback) => {
    // !origin nghĩa là request từ Server-to-Server hoặc Mobile App/Postman (không qua trình duyệt) -> Cho phép
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Nếu domain lạ gọi vào -> Chặn ngay lập tức
      callback(new Error('Not allowed by CORS'));
    }
  },

  // 2. Cho phép gửi Cookie/Auth Header (Cực quan trọng với JWT/Session)
  credentials: true,

  // 3. Giới hạn Methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // 4. Các Headers được phép gửi lên
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  
  // 5. Cache kết quả Preflight request (OPTIONS) trong 10 phút
  // Giúp giảm tải server, trình duyệt không cần hỏi "Được phép không?" liên tục
  maxAge: 600, 
};
export default corsOptions;