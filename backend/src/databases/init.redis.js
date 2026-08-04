import Redis from "ioredis";

// Khởi tạo Redis client
// Sử dụng biến môi trường REDIS_URL, nếu không có thì mặc định dùng localhost:6379
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redisClient.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redisClient.on("error", (error) => {
  console.error("❌ Redis connection error:", error);
});

export default redisClient;
