import axiosClient from "@/src/core/api/axios-instance";

export const getAllAmenitiesService = async () => {
    return await axiosClient.get(`/amenity`);
};
