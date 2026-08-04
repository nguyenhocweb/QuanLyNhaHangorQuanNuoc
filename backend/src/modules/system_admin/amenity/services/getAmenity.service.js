import { getAmenitysRepo, getAmenityByIdRepo } from "../repositories/getAmenity.repo.js";

export const getAllAmenitiesService = async (query) => {
    return getAmenitysRepo(query);
};

export const getAmenityService = async (id) => {
    return getAmenityByIdRepo(id);
};