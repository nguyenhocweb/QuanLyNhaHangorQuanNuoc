import axiosClient from "@/src/core/api/axios-instance";
import { FetchUsersResponse, GetUsersParams, CreateUserPayload, CreateUserResponse, UpdateUserPayload, UpdateUserResponse } from "../type/usersSytem-type";
import { User } from "../type/usersSytem-type";

export const UserService = {
  getUsers: async (params: GetUsersParams) => {
    const response = await axiosClient.get<FetchUsersResponse>('/system-admin/account', { params });
    return response.data;
  },
  
  // Ví dụ hàm get detail theo format của bạn (để dành dùng sau này)
  getUserById: async (id: string) => {
    const response = await axiosClient.get<User>(`/system-admin/account/${id}`);
    return response.data;
  },

  createUser: async (payload: CreateUserPayload): Promise<CreateUserResponse> => {
    // API call to create user
    const response = await axiosClient.post<CreateUserResponse>('/system-admin/account', payload);
    return response.data;
  },

  updateUser: async (id: string | number, payload: UpdateUserPayload): Promise<UpdateUserResponse> => {
    const response = await axiosClient.put<UpdateUserResponse>(`/system-admin/account/${id}`, payload);
    return response.data;
  }
};