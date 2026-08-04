export interface RestaurantInfo {
    id: string;
    name: string;
    logo?: string;
    address?: {
        street?: string;
        ward?: string;
        district?: string;
        city?: string;
    };
    phone_contact?: string;
    cancellation_hours: number;
}

export interface ReservationTable {
    table: {
        table_number: string;
        is_vip: boolean;
    };
}

export interface CustomerReservation {
    id: string;
    confirmation_code: string;
    restaurantId: string;
    guest_name: string;
    guest_phone: string;
    guest_email?: string;
    reservation_date: string;
    start_time: string;
    end_time: string;
    party_size: number;
    status: 'PENDING' | 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    special_requests?: string;
    deposit_paid: boolean;
    deposit_amount?: number;
    cancellation_reason?: string;
    createdAt: string;
    
    restaurant?: RestaurantInfo;
    reservation_tables?: ReservationTable[];
}

export interface GetReservationsResponse {
    data: CustomerReservation[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
