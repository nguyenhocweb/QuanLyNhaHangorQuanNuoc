export interface IOperatingHour {
    id?: string;
    restaurantId?: string;
    day_of_week: number;
    is_closed: boolean;
    open_time: string | null;
    close_time: string | null;
    break_start: string | null;
    break_end: string | null;
}
