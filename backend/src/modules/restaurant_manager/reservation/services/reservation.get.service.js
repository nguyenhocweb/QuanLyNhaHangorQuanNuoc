import { getReservationsRepo, getReservationByIdRepo } from "../repositories/reservation.get.repo.js";

export const getReservationsService = async (restaurantId, filters) => {
    return await getReservationsRepo(restaurantId, filters);
};

export const getReservationByIdService = async (id, restaurantId) => {
    return await getReservationByIdRepo(id, restaurantId);
};
