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
    phoneContact?: string,
    emailContact?: string,
    maxPartySize?: number,
    bookingWindowDays?: number,
    cancellationHours?: number,
    depositRequired?: boolean,
    depositPerPax?: number,
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