import { getUpgradeRequests as repoGetUpgradeRequests } from "../repositories/index.js";

export const getUpgradeRequestsService = async (query) => {
    return repoGetUpgradeRequests(query);
};
