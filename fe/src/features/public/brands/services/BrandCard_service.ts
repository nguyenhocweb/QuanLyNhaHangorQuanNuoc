import axiosClient from "@/src/core/api/axios-instance";
import { BrandCardResponseType, BrandCardRequestType } from "../types/brand-card-type";

export const BrandCardSevice = async ({ page, limit, search, city }: BrandCardRequestType): Promise<BrandCardResponseType> => {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(limit));

    if (search) params.append("search", search);
    if (city) params.append("city", city);
    const response = await axiosClient.get<BrandCardResponseType>(`/brand?${params.toString()}`);
    return response.data;
}