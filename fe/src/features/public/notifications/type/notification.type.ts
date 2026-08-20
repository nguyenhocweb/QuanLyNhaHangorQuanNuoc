export type NotificationType = 
  | "SYSTEM" 
  | "RESERVATION" 
  | "ORDER" 
  | "INVENTORY" 
  | "SUBSCRIPTION" 
  | "PROMOTION" 
  | "CUSTOM";

export interface INotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  referenceId?: string | null;
  referenceType?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsResponse {
  message: string;
  metadata: {
    data: INotification[];
    total: number;
    unreadCount: number;
  };
}
