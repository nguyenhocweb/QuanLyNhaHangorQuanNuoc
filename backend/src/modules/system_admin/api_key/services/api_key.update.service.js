import { updateApiKeyRepo } from "../repositories/api_key.update.repo.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const updateApiKeyService = async (id, brandId, data) => {
  const { name, contactEmail, restrictedModelId, keyType } = data;

  if (!name) {
    throw new BadRequestError("Vui lòng nhập tên API Key");
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
  if (keyType !== undefined) updateData.keyType = keyType;
  if (restrictedModelId !== undefined) {
    updateData.restrictedModelId = restrictedModelId ? restrictedModelId : null;
  }

  const updatedKey = await updateApiKeyRepo(id, updateData, brandId);

  return {
    id: updatedKey.id,
    name: updatedKey.name,
    prefix: updatedKey.prefix
  };
};
