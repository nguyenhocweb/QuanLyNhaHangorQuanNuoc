export interface RestaurantCardType {
    id: string,
    name: string,
    brandName: string,
    averageRating: number,
    address: any,
    time: string,
    imageMain: string,
    isNew: boolean,
    description?: string,
    phone_contact?: string,
    email_contact?: string,
    max_party_size?: number,
    booking_window_days?: number,
    cancellation_hours?: number,
    deposit_required?: boolean,
    deposit_amount?: number,
    totalRating?: number,
    average_food_rating?: number,
    average_service_rating?: number,
    average_ambiance_rating?: number,
    categories?: { name: string, bgColor?: string, textColor?: string }[],
}

export interface RestaurantCardResponseType {
    data: RestaurantCardType[],
    total: number,
}
export interface RestaurantCardRequestType {
    page: number,
    limit: number,
    city?: string,
    search?: string,
    id?: string,
    categoryRestaurant?: string[],
    review?: number,
}