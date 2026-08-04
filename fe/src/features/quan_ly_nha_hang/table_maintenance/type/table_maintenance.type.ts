export type MaintenanceStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface ITableMaintenanceSchedule {
    id: string;
    restaurantId: string;
    tableIds: string[];
    tables?: {
        id: string;
        table_number: string;
        table_type: string;
    }[];
    start_time: string;
    end_time: string;
    reason?: string;
    status: MaintenanceStatus;
    created_by_staff_id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICreateTableMaintenancePayload {
    restaurantId: string;
    tableIds: string[];
    start_time: string;
    end_time: string;
    reason?: string;
}

export interface IUpdateTableMaintenancePayload {
    status?: MaintenanceStatus;
    start_time?: string;
    end_time?: string;
    reason?: string;
    tableIds?: string[];
}
