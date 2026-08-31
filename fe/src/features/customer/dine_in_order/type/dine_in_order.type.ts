export interface MenuItemVariant {
    id: string;
    name: string;
    price: number;
    priceAdjustment?: number;
}

export interface ModifierOptionData {
    id: string;
    name: string;
    priceExtra: number;
}

export interface ModifierGroupData {
    id: string;
    name: string;
    minSelections?: number;
    maxSelections?: number;
    options: ModifierOptionData[];
}

export interface MenuItemData {
    id: string;
    name: string;
    description?: string;
    image?: string;
    images?: string[];
    price: number;
    basePrice?: number;
    is_featured?: boolean;
    allergens?: string[];
    spice_level?: number;
    prep_time?: number;
    variants?: MenuItemVariant[];
    modifierGroups?: ModifierGroupData[];
}

export interface MenuCategoryData {
    id: string;
    name: string;
    description?: string;
    items: MenuItemData[];
}

export interface RestaurantMenuData {
    id: string;
    name: string;
    description?: string;
    categories?: MenuCategoryData[];
    menucategory?: MenuCategoryData[];
}

export interface CartItem {
    cartItemId: string; // ID duy nhất cho từng combo size & topping
    menuItemId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    selectedVariant?: MenuItemVariant | null;
    selectedModifiers?: ModifierOptionData[];
    note?: string;
    image?: string;
}

export type KitchenStatus = 'QUEUED' | 'PREPARING' | 'READY' | 'SERVING' | 'SERVED' | 'CANCELLED';

export interface OrderItemDetail {
    id: string;
    orderId: string;
    menuItemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    discountAmount: number;
    totalPrice: number;
    note?: string | null;
    status: KitchenStatus;
    createdAt: string;
    menuItem?: {
        image?: string;
        description?: string;
    };
}

export interface ActiveOrderData {
    id: string;
    order_number: string;
    status: string;
    subtotal: number;
    discount_amount: number;
    tax_amount: number;
    total_amount: number;
    items: OrderItemDetail[];
    table?: {
        id: string;
        table_number: string;
    };
    createdAt: string;
}

export interface ReservationDetailData {
    id: string;
    confirmation_code: string;
    guest_name: string;
    guest_phone: string;
    reservation_date: string;
    start_time: string;
    party_size: number;
    status: string;
    restaurant?: {
        id: string;
        name: string;
        logo?: string;
        address?: {
            street?: string;
            district?: string;
            city?: string;
        };
    };
    reservation_tables?: Array<{
        table: {
            id: string;
            table_number: string;
            min_capacity?: number;
            max_capacity?: number;
            area?: {
                id: string;
                name: string;
            };
        };
    }>;
}

export interface EffectiveTaxConfig {
    isVatInclusive: boolean;
    defaultVatRate: number;
    applyServiceCharge: boolean;
    serviceChargeRate: number;
    source?: 'BRAND' | 'RESTAURANT' | 'NONE';
}

export interface ActiveOrderResponse {
    reservation: ReservationDetailData;
    order: ActiveOrderData | null;
    taxConfig?: EffectiveTaxConfig;
}

export interface CreateDineInOrderPayload {
    reservationId: string;
    items: Array<{
        menuItemId: string;
        name: string;
        quantity: number;
        unitPrice: number;
        note?: string;
    }>;
}
