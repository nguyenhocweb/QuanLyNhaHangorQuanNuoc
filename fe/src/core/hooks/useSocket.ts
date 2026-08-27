import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Single Source of Truth cho Socket URL (Fallback về Port 4000 của Backend)
const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace('/api/v1', '') || process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

let socketInstance: Socket | null = null;

// Hàm cấp phát chung 1 kết nối duy nhất (Singleton Pattern)
export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
  }
  return socketInstance;
};

export const useSocket = (restaurantId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const currentSocket = getSocket();
    setSocket(currentSocket);

    const onConnect = () => {
      setIsConnected(true);
      if (restaurantId) {
        currentSocket.emit('join_restaurant', restaurantId);
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    currentSocket.on('connect', onConnect);
    currentSocket.on('disconnect', onDisconnect);

    // Nếu đã connect từ trước
    if (currentSocket.connected) {
      onConnect();
    }

    return () => {
      currentSocket.off('connect', onConnect);
      currentSocket.off('disconnect', onDisconnect);
    };
  }, [restaurantId]);

  return { socket, isConnected };
};
