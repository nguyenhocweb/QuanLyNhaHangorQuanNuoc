export interface RestaurantCardType {
    id: string,
    name: string,
    brandName: string,
    averageRating: number,
    address: string,
    time: string,
    imageMain: string,
    isNew: boolean,
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