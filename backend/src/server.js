import app from "./app.js";
import { appConfig } from "./config/app.config.js";

import { connectDB, disconnectDB } from './databases/init.mongodb.js'; // Import logic DB bạn vừa viết
const port = appConfig.port;


const startServer = async () => {
  try {
    // 1. Kết nối Database trước (Quan trọng!)
    await connectDB();

    // 2. Nếu DB ngon lành -> Mới bật Server
    const server = app.listen(port, () => {
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