import { apiClient, protectedApiClient } from '@api/api-client';
import { ResponseResult } from '@api/types';
import { Venue } from '@api/venues';

import { StaffRole } from '@utils/storage/auth';

type LoginBody = {
  email: string;
  password: string;
};

type AuthorizationData = {
  accessToken: string;
};

export const loginOrFail = async (body: LoginBody) => {
  const response = await apiClient.request<ResponseResult<AuthorizationData>>({
    url: '/staff/login',
    method: 'POST',
    data: body,
    withCredentials: true,
  });

  return response.data.data;
};

export const logoutOrFail = async () => {
  const response = await apiClient.request<ResponseResult>({
    url: '/staff/logout',
    method: 'POST',
    withCredentials: true,
  });

  return response.data.data;
};

export const refreshToken = async () => {
  try {
    const response = await apiClient.request<ResponseResult<AuthorizationData>>(
      {
        url: '/staff/refresh-token',
        method: 'GET',
        withCredentials: true,
      },
    );

    return response.data.data;
  } catch {
    return undefined;
  }
};

export type Staff = {
  _id: string;
  name: string;
  email: string;
  venues: Venue[];
  role: StaffRole;
};

type GetAllStaffData = { staff: Staff[] };

export const getAllStaffOrFail = async () => {
  const response = await protectedApiClient.request<
    ResponseResult<GetAllStaffData>
  >({
    url: '/staff',
    method: 'get',
  });

  return response?.data.data;
};

export type CreateStaffBody = {
  email: string;
  name: string;
  role: StaffRole;
  venues: string[];
};

export const createStaffOrFail = async (body: CreateStaffBody) => {
  const response = await protectedApiClient.request<ResponseResult<Staff>>({
    url: '/staff/create',
    method: 'post',
    data: body,
  });

  return response.data.data;
};

export type EditStaffBody = Partial<CreateStaffBody>;

export const editStaffOrFail = async (id: string, body: EditStaffBody) => {
  const response = await protectedApiClient.request<ResponseResult<Staff>>({
    url: `/staff/${id}/edit`,
    method: 'post',
    data: body,
  });

  return response?.data.data;
};
