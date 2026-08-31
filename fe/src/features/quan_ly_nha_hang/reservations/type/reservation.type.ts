export type ReservationStatus = "PENDING" | "CONFIRMED" | "SEATED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
export type ReservationSource = "WEB" | "MOBILE" | "PHONE" | "WALK_IN" | "THIRD_PARTY";
export type Occasion = "NORMAL" | "BIRTHDAY" | "ANNIVERSARY" | "BUSINESS" | "DATE" | "OTHER";

export interface Reservation {
    id: string;
    confirmation_code: string;
    restaurantId: string;
    guest_name: string;
    guest_phone: string;
    guest_email?: string;
    reservation_date: string; // ISO Date string
    start_time: string;
    end_time?: string;
    party_size: number;
    status: ReservationStatus;
    source?: ReservationSource;
    occasion?: Occasion;
    special_requests?: string;
    dietary_restrictions?: any;
    internal_notes?: string;
    deposit_paid?: boolean;
    deposit_amount?: number;
    confirmed_at?: string;
    cancelled_at?: string;
    cancellation_reason?: string;
    seated_at?: string;
    completed_at?: string;
    createdAt: string;
    updatedAt: string;
    // Relationships
    reservation_tables?: Array<{
        id: string;
        reservationId: string;
        tableId: string;
        table: {
            id: string;
            table_number: string;
            status?: string;
            type?: string;
            area?: {
                id: string;
                name: string;
            };
        }
    }>;
}

export interface ReservationStats {
    pending: number;
    today: number;
    seated: number;
    upcoming: number;
}

export interface GetReservationsResponse {
    data: Reservation[];
    stats?: ReservationStats;
    total: number;
    page: number;
    limit: number;
}
