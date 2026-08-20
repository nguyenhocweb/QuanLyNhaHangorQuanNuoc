import { invoiceService } from "../services/invoice.service.js";

class InvoiceController {
    async getInvoices(req, res) {
        // Lấy brandId từ req.params (đã có mergeParams: true)
        const brandId = req.params.id_brand;
        const result = await invoiceService.getInvoices(brandId, req.query);

        res.json({
            message: "Lấy danh sách hóa đơn thành công",
            metadata: result
        });
    }
}

export const invoiceController = new InvoiceController();
