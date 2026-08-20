import { getPermissionsRepo } from "../repositories/permission.get.repo.js";

export const getPermissionsService = async () => {
  const permissions = await getPermissionsRepo();
  
  // Nhóm permissions theo type để Frontend dễ sử dụng
  const groupedPermissions = permissions.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {});

  return groupedPermissions;
};
