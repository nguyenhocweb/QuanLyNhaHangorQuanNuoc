import { deleteSupplierRepo, findSupplierByIdRepo } from "../repositories/supplier.delete.repo.js";
import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";

export const deleteSupplierService = async (id, brandId) => {
  const supplier = await findSupplierByIdRepo(id);
  if (!supplier || supplier.brandId !== brandId) {
    throw new NotFoundError("Không tìm thấy nhà cung cấp");
  }
  
  try {
    return await deleteSupplierRepo(id);
  } catch (error) {
    // If Prisma throws a relational constraint error (like P2003 or P2014) or similar violations in MongoDB
    throw new ConflictError("Không thể xóa nhà cung cấp này vì đã có dữ liệu liên quan (Đơn nhập hàng, Hàng hóa...). Vui lòng chuyển trạng thái sang Ngừng sử dụng.");
  }
};
