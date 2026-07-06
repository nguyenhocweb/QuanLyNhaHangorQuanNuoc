import { accountDeleteRepository } from "../repositories/account.delete.repository.js";

export const deleteAccountService = async (id) => {
  return accountDeleteRepository.deleteUserById(id);
};
