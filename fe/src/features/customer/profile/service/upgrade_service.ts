import axiosClient from "../../../../core/api/axios-instance";

export interface UpgradeRequestPayload {
    brandName: string;
    logo?: string;
    description?: string;
    representativeName?: string;
    phoneContact?: string;
    emailContact?: string;
    address?: {
        street?: string;
        ward?: string;
        district?: string;
        province?: string;
    };
    taxCode?: string;
    businessLicense?: string;
    identityCard?: string[];
}

export const createUpgradeRequest = async (data: UpgradeRequestPayload) => {
    const response = await axiosClient.post("/user/upgrade-request", data);
    return response.data;
};
