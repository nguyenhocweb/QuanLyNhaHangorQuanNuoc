import { getMyInvoicesService } from "../invoice.service/GetMyInvoices.service.js";

export const getMyInvoicesController = async (req, res) => {
    const userId = req.user.id;
    const query = req.query;

    const result = await getMyInvoicesService(userId, query);

    res.status(200).json({
        message: "Lấy danh sách hóa đơn thành công",
        metadata: result
    });
};
