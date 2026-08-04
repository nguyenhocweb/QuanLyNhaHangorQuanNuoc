import axiosClient from "@/src/core/api/axios-instance";
import { BrandCardResponseType, BrandCardRequestType } from "../types/brand-card-type";

export const BrandCardSevice = async ({ page, limit, search, city, isFeatured, isNew }: BrandCardRequestType): Promise<BrandCardResponseType> => {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(limit));

    if (search) params.append("search", search);
    if (city) params.append("city", city);
    if (isFeatured !== undefined) params.append("isFeatured", String(isFeatured));
    if (isNew !== undefined) params.append("isNew", String(isNew));
    const response = await axiosClient.get<BrandCardResponseType>(`/brand?${params.toString()}`);
    return response.data;
}