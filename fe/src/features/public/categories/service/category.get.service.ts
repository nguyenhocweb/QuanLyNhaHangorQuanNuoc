import axiosClient from "@/src/core/api/axios-instance";

export const getPublicCategoriesService = async () => {
    const response = await axiosClient.get("/category");
    return response.data;
};
