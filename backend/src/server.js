import app from "./app.js";
import { appConfig } from "./config/app.config.js";
import http from "http";
import { Server } from "socket.io";
import corsOptions from "./core/middlewares/cors.middlewares.js";

import { connectDB, disconnectDB } from './databases/init.mongodb.js'; // Import logic DB bạn vừa viết
const port = appConfig.port || 4000;

// Khởi tạo HTTP Server bọc ngoài Express
const httpServer = http.createServer(app);

// Khởi tạo Socket.IO với cấu hình CORS đồng bộ với Express
const io = new Server(httpServer, {
  cors: corsOptions
});

global.io = io; // Public instance để tái sử dụng ở Controller/Service

io.on("connection", (socket) => {
  console.log(`🔌 [Socket.IO] Client connected: ${socket.id}`);
  
  socket.on("join_restaurant", (restaurantId) => {
    socket.join(restaurantId);
    console.log(`🔌 [Socket.IO] Client ${socket.id} joined room: ${restaurantId}`);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const startServer = async () => {
  try {
    // 1. Kết nối Database trước (Quan trọng!)
    await connectDB();

    // 2. Nếu DB ngon lành -> Mới bật Server (Dùng httpServer thay vì app)
    const server = httpServer.listen(port, () => {
      console.log(`🚀 Server is running on: http://localhost:${port}`);
    });

    // --- GRACEFUL SHUTDOWN (Tắt server an toàn chuẩn Senior) ---
    // Khi bấm Ctrl + C hoặc Server bị kill, code này sẽ chạy
    const exitHandler = () => {
      if (server) {
        server.close(async () => {
          console.log('\n🔒 HTTP Server closed');

          // Đóng kết nối Database sạch sẽ
          await disconnectDB();
          console.log('zzZ MongoDB Disconnected');

          process.exit(0); // Thoát chương trình thành công
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error) => {
      console.error('❌ Unexpected Error:', error);
      exitHandler();
    };

    // Bắt các lỗi không lường trước (Uncaught Exception / Unhandled Rejection)
    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    // Bắt sự kiện tắt server (Ctrl + C)
    process.on('SIGINT', exitHandler);

    process.on('SIGTERM', exitHandler);

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// Kích hoạt
startServer();