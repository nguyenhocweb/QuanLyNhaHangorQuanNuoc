import { searchUsersRepo } from "../repositories/user.search.repo.js";

export const searchUsersService = async (keyword) => {
  if (!keyword || keyword.trim().length === 0) {
    return [];
  }

  const users = await searchUsersRepo(keyword);
  return users;
};
