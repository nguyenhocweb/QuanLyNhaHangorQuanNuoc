import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './useSocket';

export const useRealtimeUpdates = (restaurantId?: string) => {
  const { socket, isConnected } = useSocket(restaurantId);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !restaurantId) return;

    const handleTableUpdate = () => {
      // Invalidate table and area query keys across different roles
      queryClient.invalidateQueries({ queryKey: ["areas-with-tables"] });
      queryClient.invalidateQueries({ queryKey: ["TABLES"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["BrandTables"] });
      queryClient.invalidateQueries({ queryKey: ["BrandAreas"] });
      queryClient.invalidateQueries({ queryKey: ["table-maintenance"] });
    };

    const handleReservationUpdate = () => {
      // Invalidate reservation query keys across different roles
      queryClient.invalidateQueries({ queryKey: ["RESERVATIONS"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      // Also invalidate table queries in case table assignment changed
      handleTableUpdate();
    };

    const handleMenuUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });
    };

    const handleStaffUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-staffs"] });
    };

    socket.on("table_updated", handleTableUpdate);
    socket.on("table_status_changed", handleTableUpdate);
    socket.on("reservation_updated", handleReservationUpdate);
    socket.on("menu_updated", handleMenuUpdate);
    socket.on("staff_updated", handleStaffUpdate);

    return () => {
      socket.off("table_updated", handleTableUpdate);
      socket.off("table_status_changed", handleTableUpdate);
      socket.off("reservation_updated", handleReservationUpdate);
      socket.off("menu_updated", handleMenuUpdate);
      socket.off("staff_updated", handleStaffUpdate);
    };
  }, [socket, restaurantId, queryClient]);


  return { isConnected };
};

export default useRealtimeUpdates;
