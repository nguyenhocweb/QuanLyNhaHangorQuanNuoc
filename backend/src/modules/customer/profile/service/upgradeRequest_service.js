import { createUpgradeRequest, updateUpgradeRequest, findUpgradeRequestByUserId } from "../repository/index.js";
import { ConflictError } from "../../../../core/constants/error/index.js";

export const upgradeRequestService = async (userId, data) => {
    const existingRequest = await findUpgradeRequestByUserId(userId);

    const formattedData = {
        brandName: data.brandName,
        logo: data.logo || null,
        description: data.description || null,
        representativeName: data.representativeName || null,
        phone_contact: data.phoneContact || data.phone_contact || null,
        email_contact: data.emailContact || data.email_contact || null,
        address: data.address || null,
        tax_code: data.taxCode || data.tax_code || null,
        businessLicense: data.businessLicense || null,
        identityCard: Array.isArray(data.identityCard) ? data.identityCard : [],
        rejectionReason: null,
        status: "PENDING"
    };

    if (existingRequest) {
        if (existingRequest.status === "PENDING") {
            throw new ConflictError("Bạn đã có đơn yêu cầu đang chờ xử lý. Vui lòng chờ phản hồi từ quản trị viên.");
        }
        
        if (existingRequest.status === "APPROVED") {
            throw new ConflictError("Yêu cầu trước đó của bạn đã được phê duyệt. Bạn đã là đối tác của hệ thống.");
        }

        if (existingRequest.status === "REJECTED") {
            // Nộp lại đơn bị từ chối
            return await updateUpgradeRequest(userId, formattedData);
        }
    }

    // Nếu chưa có đơn nào thì tạo mới
    return await createUpgradeRequest({
        ...formattedData,
        userId
    });
};
