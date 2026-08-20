import { getSuppliersRepo } from "../repositories/supplier.get.repo.js";

export const getSuppliersService = async (brandId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const take = limit;
  
  const { suppliers, totalCount } = await getSuppliersRepo(brandId, skip, take);
  
  const formattedSuppliers = suppliers.map(supplier => {
    if (supplier.contact) {
      try {
        supplier.contact = JSON.parse(supplier.contact);
      } catch (error) {
        // Fallback in case it's not a valid JSON string
        supplier.contact = { contactName: supplier.contact };
      }
    }
    return supplier;
  });
  
  return {
    items: formattedSuppliers,
    options: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      limit
    }
  };
};
