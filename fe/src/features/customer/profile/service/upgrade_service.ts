import axiosClient from "../../../../core/api/axios-instance";
import { UpgradeFormValues } from "../schema/upgrade-schema";

export const createUpgradeRequest = async (data: UpgradeFormValues & { businessLicense: string }) => {
    const response = await axiosClient.post("/users/upgrade-request", data);
    return response.data;
};
