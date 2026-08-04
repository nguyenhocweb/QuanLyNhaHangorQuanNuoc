import { getTagsRepo, getTagByIdRepo } from "../repositories/getTag.repo.js";

export const getAllTagsService = async (query) => {
    return getTagsRepo(query);
};

export const getTagService = async (id) => {
    return getTagByIdRepo(id);
};