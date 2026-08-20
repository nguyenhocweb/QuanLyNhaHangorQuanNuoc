import { createStockTransferRepo } from "../repositories/stock_transfer.create.repo.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const createStockTransferService = async (data) => {
  if (data.fromRestaurantId === data.toRestaurantId) {
    throw new BadRequestError("Kho xuất và kho nhập không được trùng nhau");
  }

  const transferNumber = `TR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

  return await createStockTransferRepo({
    ...data,
    transferNumber
  });
};
