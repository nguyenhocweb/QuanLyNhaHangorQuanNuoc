import { deleteNotificationService } from "../services/notification.delete.service.js";

export const deleteNotificationController = {
  deleteNotification: async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    // workspaceTypeOverride cho phép FE truyền lên chính xác workspaceType của notification
    // Dùng trong trường hợp User đang ở Customer nhưng lại muốn xóa System (thực chất nó đang ở tab Hệ thống)
    const workspaceType = req.query.workspaceType || req.workspaceContext || "CUSTOMER";

    await deleteNotificationService.deleteNotification(id, workspaceType, userId);

    res.status(200).json({
      message: "Xóa thông báo thành công"
    });
  }
};
