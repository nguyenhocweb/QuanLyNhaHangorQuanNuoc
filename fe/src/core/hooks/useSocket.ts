import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';

let socketInstance: Socket | null = null;

export const useSocket = (restaurantId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        reconnectionAttempts: 5,
        withCredentials: true,
      });
    }

    setSocket(socketInstance);

    const onConnect = () => {
      setIsConnected(true);
      if (restaurantId) {
        socketInstance?.emit('join_restaurant', restaurantId);
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);

    // Nếu đã connect từ trước
    if (socketInstance.connected) {
      onConnect();
    }

    return () => {
      socketInstance?.off('connect', onConnect);
      socketInstance?.off('disconnect', onDisconnect);
    };
  }, [restaurantId]);

  return { socket, isConnected };
};
