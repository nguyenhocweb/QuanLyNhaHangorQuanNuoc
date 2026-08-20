import 'dotenv/config'; 

const config = {
  mongodb: {
    // 1. Lấy URL trực tiếp từ biến môi trường
    url: process.env.DATABASE_URL,

    // 2. Điền cứng tên Database (hoặc lấy từ env nếu có)
    databaseName: process.env.MONGO_DB_NAME,

    options: {
      // useNewUrlParser: true, // (Không cần thiết)
      // useUnifiedTopology: true, // (Không cần thiết)
    }
  },

  // --- QUAN TRỌNG NHẤT ---
  // Đây là đường dẫn mà bạn vừa xác nhận là đã tồn tại
  migrationsDir: "src/db/mongodb/migrations",

  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  
  // Dự án bạn dùng "type": "module" nên phải để là esm
  moduleSystem: 'esm',
};

export default config;