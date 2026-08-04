import axiosClient from "@/src/core/api/axios-instance";

export const getAllTagsService = async () => {
    const response = await axiosClient.get("/tag");
    return response;
};
