import { apiClient, protectedApiClient } from '@api/api-client';
import { Booking } from '@api/bookings';
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
    url: '/admin/staff/login',
    method: 'POST',
    data: body,
    withCredentials: true,
  });

  return response.data.data;
};

export const logoutOrFail = async () => {
  const response = await apiClient.request<ResponseResult>({
    url: '/admin/staff/logout',
    method: 'POST',
    withCredentials: true,
  });

  return response.data.data;
};

export const refreshToken = async () => {
  try {
    const response = await protectedApiClient.request<
      ResponseResult<AuthorizationData>
    >({
      url: '/admin/staff/refresh-token',
      method: 'GET',
      withCredentials: true,
    });

    return response.data.data;
  } catch {
    return undefined;
  }
};

export type Staff = {
  _id: string;
  name: string;
  email: string;
  venue?: Venue;
  role: StaffRole;
};

export const getAllStaffOrFail = async () => {
  const response = await protectedApiClient.request<ResponseResult<Staff[]>>({
    url: '/admin/staff',
    method: 'get',
  });

  return response?.data.data;
};

export type CreateStaffBody = {
  email: string;
  name: string;
  role: StaffRole;
  venue: string;
};

export const createStaffOrFail = async (body: CreateStaffBody) => {
  const response = await protectedApiClient.request<ResponseResult<Staff>>({
    url: '/admin/staff/create',
    method: 'post',
    data: body,
  });

  return response.data.data;
};

export type EditStaffBody = Partial<CreateStaffBody>;

export const editStaffOrFail = async (id: string, body: EditStaffBody) => {
  const response = await protectedApiClient.request<ResponseResult<Staff>>({
    url: `/admin/staff/${id}/edit`,
    method: 'post',
    data: body,
  });

  return response?.data.data;
};

export const deleteStaffOrFail = async (id: string) => {
  try {
    await protectedApiClient.request({
      url: `/admin/staff/${id}`,
      method: 'delete',
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

type GetBookingsByStaffQuery = {
  start: Date;
  end: Date;
  id: string;
};

export const getBookingsByStaffOrFail = async ({
  id,
  start,
  end,
}: GetBookingsByStaffQuery) => {
  const response = await protectedApiClient.request<ResponseResult<Booking[]>>({
    url: `/admin/staff/${id}/bookings`,
    method: 'get',
    params: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
  });

  return response?.data.data;
};
