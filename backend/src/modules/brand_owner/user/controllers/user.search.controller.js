import { searchUsersService } from "../services/user.search.service.js";

export const searchUsersController = async (req, res) => {
  const { keyword } = req.query;

  const users = await searchUsersService(keyword);

  return res.status(200).json({
    status: 200,
    message: "Tìm kiếm người dùng thành công",
    data: users,
  });
};
