import axiosClient from "@/src/core/api/axios-instance";

export const deleteAdminContactTicketService = async (
  id: string
): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/system-admin/contact-ticket/${id}`);
  return response.data;
};
