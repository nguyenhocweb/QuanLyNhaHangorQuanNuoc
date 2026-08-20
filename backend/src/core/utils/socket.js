import { Server } from "socket.io";
import { prisma } from "../../databases/init.mongodb.js";
import { verifyTokenAccess } from "./authUtils.js";
import corsOptions from "../middlewares/cors.middlewares.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: corsOptions, // Áp dụng chính sách CORS giống hệt Express (có credentials: true)
  });

  io.use((socket, next) => {
    try {
      const cookieHeader = socket.request.headers.cookie;
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((res, item) => {
          const data = item.trim().split('=');
          return { ...res, [data[0]]: data[1] };
        }, {});
        
        const accessToken = cookies['accessToken'];
        if (accessToken) {
          const decoded = verifyTokenAccess(accessToken);
          if (decoded && decoded.id) {
            socket.user = decoded;
          }
        }
      }
    } catch (error) {
      console.error("Socket Auth Error:", error);
    }
    next();
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    if (socket.user) {
      const userRoom = `user_${socket.user.id}`;
      socket.join(userRoom);
      console.log(`Socket ${socket.id} automatically joined personal room: ${userRoom}`);
    }

    // Tham gia vào một room cụ thể (ví dụ: room của nhà hàng)
    socket.on("join_restaurant", (restaurantId) => {
      socket.join(`restaurant_${restaurantId}`); // Chuẩn hóa prefix
      // Backward compatibility
      socket.join(restaurantId);
      console.log(`Socket ${socket.id} joined restaurant room: ${restaurantId}`);
    });

    socket.on("join_workspace", (data) => {
      if (data.restaurantId) {
        socket.join(`restaurant_${data.restaurantId}`);
        console.log(`Socket ${socket.id} joined restaurant workspace: ${data.restaurantId}`);
      }
      if (data.brandId) {
        socket.join(`brand_${data.brandId}`);
        console.log(`Socket ${socket.id} joined brand workspace: ${data.brandId}`);
      }
      if (data.isSystemAdmin) {
        socket.join(`system_admin`);
        console.log(`Socket ${socket.id} joined system admin workspace`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};

// --- Thông báo đa luồng (Multi-tenant Notifications) ---
export const emitNewNotification = (targetRoom, data) => {
  if (io && targetRoom) {
    io.to(targetRoom).emit("new_notification", data);
    console.log(`📡 Emitted new_notification to room: ${targetRoom}`, data.title);
  }
};

export const emitGlobalNotification = (data) => {
  if (io) {
    io.emit("new_notification", data);
    console.log(`📡 Emitted global new_notification to EVERYONE`, data.title);
  }
};

// --- Các hàm cũ ---
export const emitTableUpdate = (restaurantId) => {
  if (io && restaurantId) {
    io.to(restaurantId).emit("table_updated", { restaurantId });
    console.log(`📡 Emitted table_updated to room: ${restaurantId}`);
  }
};

export const emitReservationUpdate = (restaurantId) => {
  if (io && restaurantId) {
    io.to(restaurantId).emit("reservation_updated", { restaurantId });
    console.log(`📡 Emitted reservation_updated to room: ${restaurantId}`);
  }
};

export const emitMenuUpdate = (restaurantId) => {
  if (io && restaurantId) {
    io.to(restaurantId).emit("menu_updated", { restaurantId });
    console.log(`📡 Emitted menu_updated to room: ${restaurantId}`);
  }
};

export const emitBrandMenuUpdate = async (brandId) => {
  if (io && brandId) {
    try {
      const restaurants = await prisma.restaurant.findMany({
        where: { brandId },
        select: { id: true }
      });
      restaurants.forEach((r) => {
        io.to(r.id).emit("menu_updated", { restaurantId: r.id, brandId });
        console.log(`📡 Emitted menu_updated to restaurant room: ${r.id} for brand: ${brandId}`);
      });
      io.emit("brand_menu_updated", { brandId });
      console.log(`📡 Emitted brand_menu_updated globally for brand: ${brandId}`);
    } catch (error) {
      console.error(`❌ Error emitting brand menu update:`, error);
    }
  }
};

export const emitStaffUpdate = (restaurantId) => {
  if (io && restaurantId) {
    io.to(restaurantId).emit("staff_updated", { restaurantId });
    console.log(`📡 Emitted staff_updated to room: ${restaurantId}`);
  }
};

export const emitUserPermissionUpdate = (userId) => {
  if (io && userId) {
    const userRoom = `user_${userId}`;
    io.to(userRoom).emit("permission_updated", { userId });
    console.log(`📡 Emitted permission_updated to room: ${userRoom}`);
  }
};

export const emitBrandSubscriptionUpdate = (brandId) => {
  if (io && brandId) {
    io.emit("brand_subscription_updated", { brandId });
    console.log(`📡 Emitted brand_subscription_updated globally for brand: ${brandId}`);
  }
};
