import { getUpgradeRequestsService, updateUpgradeRequestStatusService } from "../services/index.js";

export const getUpgradeRequestsController = async (req, res) => {
    const query = req.query;
    const result = await getUpgradeRequestsService(query);
    return res.status(200).json({
        message: "Lấy danh sách yêu cầu nâng cấp thành công",
        metadata: result
    });
};

export const updateUpgradeRequestStatusController = async (req, res) => {
    const { id } = req.params;
    const { status, planId, rejectionReason } = req.body;
    
    const result = await updateUpgradeRequestStatusService(id, status, planId, rejectionReason);
    
    return res.status(200).json({
        message: status === "APPROVED" ? "Phê duyệt yêu cầu nâng cấp thành công" : "Từ chối yêu cầu nâng cấp thành công",
        metadata: result
    });
};
